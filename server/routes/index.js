const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')
const blog = require('./blog')
const order = require('./order')
const brand = require('./brand')
const coupon = require('./coupon')
const insert = require('./insert')
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/productcategory', productCategoryRouter)
    app.use('/api/blogCategory', blogCategoryRouter)
    app.use('/api/blog', blog)
    app.use('/api/order', order)
    app.use('/api/brand', brand)
    app.use('/api/coupon', coupon)
    app.use('/api/insert',insert)


    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes