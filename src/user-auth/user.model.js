const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    id: { type: Number, default: 0 },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    gender: { type: String },
    address: { type: String },
    phonenumber: { type: String, },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    cloudinary_url: { type: String },
    filePath: { type: String },
    image_public_id: { type: String },


}, { timestamps: true })

const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel