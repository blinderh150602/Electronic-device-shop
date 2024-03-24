const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
// Lọc sản phẩm theo tên sản phẩm (Filtering),lọc sản phẩm theo kiểu sắp xếp (sorting) & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    // Xóa query
    excludeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    // Filtering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)

    //Sorting
    //acb, efg =>[abc,efg]=> abc,efg.
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    //Fields limiting

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    //Limit: Số Object lấy về gọi API
    //Skip: 2
    //+2=> 2
    //+adqwe=> NaN
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    //Execute query
    // Số lượng sp thỏa mãn điều kiện !== số lượng sản phẩm trả về 1 lần gọi API
    try {
        //price: {gt: 5000}
        // Execute query
        const response = await queryCommand.exec()

        // Đếm số lượng sản phẩm
        const counts = await Product.find(formatedQueries).countDocuments()

        // Trả về kết quả
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')

    const ratingProduct = await Product.findById(pid)
    if (!ratingProduct) {
        throw new Error('Product not found')
    }

    const alreadyRating = ratingProduct.ratings.some(el => el.postedBy.toString() === _id)
    //console.log({ alreadyRating });

    if (alreadyRating) {
        // Cập nhật star & comment
        await Product.updateOne(
            { _id: pid, 'ratings.postedBy': _id },
            { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } }
        )
    } else {
        // Thêm mới star & comment
        await Product.findByIdAndUpdate(
            pid,
            { $push: { ratings: { star, comment, postedBy: _id } } },
            { new: true }
        )
    }

    //sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})
const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false, message: 'Missing inputs'
            })
        }
        const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
        return res.status(200).json({
            success: true, message: 'Upload Success', files: req.files
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, message: 'Can not images Product'
        })
    }
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}