const mongoose = require('mongoose')
const { array } = require('../middleware/uploadImages')
const Schema =mongoose.Schema

const PostSchema = new Schema({
    iduser: {
        type: String,
        required: true,
        unique:true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: array
    }

    
})
module.exports = mongoose.model('posts', PostSchema)