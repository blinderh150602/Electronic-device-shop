const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user',
    },
    cart:{
        type: Array,
        default:[]
    },
    address:[{type: mongoose.Types.ObjectId, ref:'Address'}],
    wishlist:[{type: mongoose.Types.ObjectId, ref:'Product'}],
    isBloked:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String
    },
    passwordChangeAt:{
        type:String
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpries:{
        type:String
    },
}, {
    timestamps: true
});

// salt for imformation password. The more salt, the harder it is for user to guess!
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//Export the model
module.exports = mongoose.model('User', userSchema);