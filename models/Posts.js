const mongoose = require('mongoose')
const Schema =mongoose.Schema

const PostSchema = new Schema({
    ownerid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: false
    },
    type: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      required: true,
    },
    like: [{
      userid: {
        type: Schema.Types.ObjectId, 
        required: true
      },
      liked: {
        type: Number,
        required: true
      }
    }],
    images: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
}, {timestamp: true})
module.exports = mongoose.model('posts', PostSchema)