const asyncHandler = require('express-async-handler')
const Blog = require('../models/blog')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if(!title || !description || !category) throw new Error('Missing inputs')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})
const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot create update blog'
    })
})
const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot create get blog'
    })
})



const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.body
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const isLiked = blog.likes.includes(_id)
    if (isLiked) {
        // Nếu đã thích, loại bỏ lượt thích
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        });
    } else {
        // Nếu chưa thích, thêm lượt thích
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const isDisliked = blog.disliked.includes(_id)
    if (isDisliked) {
        // Nếu đã không thích, loại bỏ lượt không thích
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { disliked: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        });
    } else {
        // Nếu chưa không thích, thêm lượt không thích
        const response = await Blog.findByIdAndUpdate(bid, { $push: { disliked: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})
//const excludedFields = '-refreshToken -password -role -createdAt -updatedAt '
const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: {numberViews: 1} },{new: true})
        .populate('likes', 'firstname lastname')
        .populate('disliked', 'firstname lastname')
    return res.json({
        success: blog ? true : false,
        rs: blog
    })
})
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid)
    return res.json({
        success: blog ? true : false,
        deletedBlog: blog || 'Something went wrong!'
    })
})
const uploadImagesBlog = asyncHandler(async (req, res) => {
    try {
        const { bid } = req.params
        if (!bid) {
            return res.status(400).json({
                success: false, message: 'Missing blog ID'
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false, message: 'Missing inputs'
            })
        }
        const response = await Blog.findByIdAndUpdate(bid, {image: req.file.path}, {new: true})
        return res.status(200).json({
            success: true, message: 'Upload Success', file: req.file
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, message: 'Can not Image blog'
        })
    }
})


module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImagesBlog
}