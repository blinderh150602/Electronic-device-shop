const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews: {
        type:Number,
        default:0
    },
    likes: [
        {
            type:mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    disliked: [
        {
            type:mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fflat-lay-workstation-with-copy-space-laptop_23-2148430879.jpg&tbnid=Ucn8WCaj8HF6QM&vet=12ahUKEwiNvJTTrOKEAxWBhWMGHZe-C4AQMygBegQIARBT..i&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fblog-background&docid=rSqrvG1HqwXB1M&w=626&h=352&q=gambar%20background%20blog&ved=2ahUKEwiNvJTTrOKEAxWBhWMGHZe-C4AQMygBegQIARBT'
    },
    author: {
        type: String,
        default: 'Admin'
    }, 
}, {
    // (toJSON và toObject) có trong (virtuals) ở mongoose, là một giá trị ảo không được lưu trữ trong mdb. Quá trình sử dụng hàm này sẽ được phát sinh trong quá trình viết logic
    timestamps: true,
    // CHỉ chạy khi gọi hàm toJSON
        toJSON: { virtuals: true },
        // CHỉ chạy khi gọi hàm toObject
        toObject: { virtuals: true }
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);