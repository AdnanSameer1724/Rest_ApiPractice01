const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    emailID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Authentication', dataSchema)