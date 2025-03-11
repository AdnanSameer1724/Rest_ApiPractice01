require('dotenv').config();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



const dataSchema = new mongoose.Schema({
    emailID: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
});

dataSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

dataSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id, emailID: this.emailID}, process.env.JWT_SECRET, { expiresIn: '1h'});
    this.token = token;
    return token;
};

module.exports = mongoose.model('Authentication', dataSchema)