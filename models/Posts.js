const mongoose = require('mongoose')
const { array } = require('../middleware/uploadImages')
const Schema =mongoose.Schema

const PostSchema = new Schema({
    userid: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    heart: {
      type: Array,
    },
    images: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
},{timestamps: true})
module.exports = mongoose.model('posts', PostSchema)