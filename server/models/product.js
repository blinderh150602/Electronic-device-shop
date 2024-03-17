const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true
    },
    description: {
        type: Array,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        enum: ['BLACK', 'BLACK LEATHER', 'MINERAL BLACK', 'QUITE BLACK', 'WHITE', 'DAZZLING WHITE', 'GOLD', 'CERAMIC', 'BROWN', 'RED', 'BLUE', 'YELLOW', 'GREEN', 'PINK', 'GRAY', 'SPACE GRAY', 'CARBON GRAY', 'SILVER']
    },    
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);