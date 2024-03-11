const asyncHandler = require('express-async-handler')
const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')

const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user._id
    //const { _id } = req.params
    const { coupon } = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    console.log(userCart)
    //Tạo danh sách sản phẩm cho đơn hàng
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,//về id(tên sản phẩm)
        count: el.quantity,//về số lượng sp
        color: el.color//theo màu sắc
    }))
    //Tổng giá trị đơn hàng-- giá sp* sl+ giá trị tích lũy mua hàng
    let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
    const createData = ({ products, total, orderBy: _id }) //await Order.create
    //xử lý mã giảm giá(coupon)
    if (coupon) {
        const selectdCoupon = await Coupon.findById(coupon)
        // tỷ lệ giảm giá vào tổng giá trị của đơn hàng, (1 - giá thị trường /100) 
        total = Math.round(total*(1- +selectdCoupon?.discount/100)/1000)*1000 || total//nếu mã lỗi giữ nguyên giá ban đầu
        createData.total = total
        createData.coupon = coupon
    }
    console.log(total);
    const rs = await Order.create(createData)
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if(!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new: true})
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id})
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

module.exports = {
    createNewOrder,
    updateStatus,
    getUserOrder,
    getOrders
}