const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')

// const register = asyncHandler(async(req, res) =>{
//     const{email, password, firstname, lastname} = req.body
//     if(!email || !password || !firstname || !lastname)
//     return res.status(400).json({
//         success: false,
//         mes: 'Missing inputs'
//     })

//     const user = await User.findOne({email})
//     if (user) throw new Error('User has existed!')
//     else{
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully. please go login' : 'Something went wrong'
//         })
//     }
// })

const register = asyncHandler(async (req, res) => {
    // Quá trình xử lý hàm khi tạo user được gửi qua email với hỗ trợ từ cookie, xác thực và ấn vào trang để chuyển hướng đến trang đăng nhập
    const { email, password, firstname, lastname, mobile } = req.body;
    if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            message: 'Missing inputs',
        });
    const user = await User.findOne({ email });
    if (user) throw new Error('User has existed!');
    else {
        const token = makeToken();
        res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
        <a href="${process.env.URL_SERVER}/api/user/finalregister/${token}">Click here</a>`;
        await sendMail({ email, html, subject: ' Hoàn tất đăng kí Digital Word!' });
        return res.json({
            success: true,
            mes: 'Please check your Email to activate account'
        });
    }
});

const finalRegister = asyncHandler(async (req, res) => {
    // Hàm finalRegister với các User đã tạo mới sẽ được truyền qua theo res trỏ từ CLIENT_URL ở server qua client 
    // để khi người dùng ấn link sẽ nhảy thẳng vào trang đăng nhập, hàm chuyển sang trang đăng nhập được xuất ở bên file finalRegister.js
    const cookie = req.cookies
    const { token } = req.params
    if (!cookie || cookie?.dataregister?.token !== token) {
        res.clearCookie('dataregister')
        return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    }
    const newUser = await User.create({
        email: cookie?.dataregister?.email,
        password: cookie?.dataregister?.password,
        mobile: cookie?.dataregister?.mobile,
        firstname: cookie?.dataregister?.firstname,
        lastname: cookie?.dataregister?.lastname,
    })
    res.clearCookie('dataregister')
    if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
});
//refresh token => cấp mới (reload, update) access token
//access token => xác thực user ,phân quyền user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    //plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async(err, decode) => {
    //if(err) throw new Error('Invalid refresh token')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})
//})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
// Client gửi email
// Server check email có hợp lệ hay không. Hợp lệ sẽ gửi mail + link (password change token)
// Client check mail và user sẽ click link
// client gửi api kèm token
// Check token có giống với token mà sẻ vẻ có gửi mail hay k
// Change password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('user not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
    const data = {
        email,
        html,
        subject: 'Forgot Password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Success! Check your mail.' : 'Error! Try late.'
    })
})

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    // Sau khi ấn vào link ForgotPassword đến ResetPassword thì hàm xử lý trong api sẽ check key token được sinh ra khi ấn vào link có trùng hay không.
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

// Lay Users
const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

// Xoa User
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})

// Cap nhat User
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

// Cap nhat User By Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    // 
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity, color } = req.body
    if (!pid || !quantity || !color) throw new Error("Missing Inputs")
    const user = await User.findById(_id).select('cart')
    // Tìm sản phẩm trong giỏ hàng
    const alreadyProduct = user.cart.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong'
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Something went wrong'
        })
    }
})



module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister
}