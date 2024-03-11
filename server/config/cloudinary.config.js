const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
//Tạo 1 storage để set up ảnh lên CloudinaryStorage thay vì lưu trên máy tính. Tạo folder 'ShopThietBiDienTu'
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'ShopThietBiDienTu'
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
