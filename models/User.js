const mongoose = require('mongoose')
const Schema =mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "avatarDefault.png"
    },
    cover: {
        type: String,
        default: "coverDefault.png"
    },
    about: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    birthday: {
        type: String,
        default: ""
    },
    gender: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "posts"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})
module.exports = mongoose.model('users', UserSchema)