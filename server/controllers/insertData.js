const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const data = require('../../data/data2.json');
const slugify = require('slugify');
const categoryData = require('../../data/cate_brand');
const productCategory = require('../models/productCategory');

const insertProduct = asyncHandler(async (req, res) => {
    const promises = data.map(async (productData) => {
        const existingProduct = await Product.findOne({ slug: slugify(productData.name) });
        if (existingProduct) {
            console.log(`Product with slug '${slugify(productData.name)}' already exists. Skipping insertion.`);
            return; // Skip insertion if product already exists
        }

        // Find the color variant in the variants array
        const colorVariant = productData.variants.find(variant => variant.label === 'Color');
        // Get the color value from the variants of the colorVariant object
        const color = colorVariant ? colorVariant.variants[0] : null;

        const product = new Product({
            title: productData.name,
            slug: slugify(productData.name),
            description: productData.description.join('\n'), // Join description array into a single string
            brand: productData.brand,
            price: Math.round(Number(productData.price?.match(/\d/g).join('')) / 100),
            category: productData.category.join(', '), // Join category array into a single string
            quantity: Math.round(Math.random() * 1000),
            sold: Math.round(Math.random() * 100),
            images: productData.images,
            color: color // Assign the color value to the color field
        });

        await product.save();
    });

    await Promise.all(promises);
    return res.json('Done');
});

const fn2 = async(cate) => {
    await productCategory.create({
        title: cate?.cate,
        brand: cate?.brand
    })
}
const insertCategory = asyncHandler(async (req, res) => {
    const promises = [];
    const categoryKeys = Object.keys(categoryData);
    for (const key of categoryKeys) {
        promises.push(fn2(categoryData[key]));
    }
    await Promise.all(promises);
    return res.json('Done');
});



module.exports = {
    insertProduct,
    insertCategory
};
