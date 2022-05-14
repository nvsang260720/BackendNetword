const mongoose = require('mongoose')
const { array } = require('../middleware/uploadImages')
const Schema =mongoose.Schema

const PostSchema = new Schema({
    idOwner: { 
        type: Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    content: {
      type: String,
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
    
})
module.exports = mongoose.model('posts', PostSchema)