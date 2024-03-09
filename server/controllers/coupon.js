const asyncHandler = require('express-async-handler')
const Coupon = require('../models/coupon')

const createNewCoupon = asyncHandler(async (req, res) => {
    const {name, discount, expiry} = req.body
    if(!name || !discount || !expiry) throw new Error('Missing inputs')
    // Tạo ngày hết hạn trong khoảng từ 10 đến 15 ngày kể từ thời điểm hiện tại bằng vòng lặp ramdom
    const expiryDays = getRandomInt(10, 15)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    const response = await Coupon.create({
        ...req.body,
        expiry: expiryDate 
    })
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new Coupon'
    })
})
// Hàm này trả về một số nguyên ngẫu nhiên trong khoảng 10 đến 15 ngày (bao gồm cả min và max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find()
    return res.json({
        success: response ? true : false,
        coupons: response ? response : 'Cannot get Coupon'
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    if(Object.keys(req.body).lenght === 0) throw new Error('Middsing inputs')
    if(req.body.expiry)req.body.expiry = Date.now() + +req.body.expiry *24 *60 *60 *1000
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update Coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete Coupon'
    })
})

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}
