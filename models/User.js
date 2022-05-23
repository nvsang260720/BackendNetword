const mongoose = require('mongoose')
const Schema =mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
        default: "https://res.cloudinary.com/drqaocsli/image/upload/v1653275810/avatar_defaul_ekmmv0.png"
    },
    cover: {
        type: String,
        default: "https://res.cloudinary.com/drqaocsli/image/upload/v1653275816/cover_defaul_slhse1.png"
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
    friends: {
        type: Schema.Types.ObjectId,
        ref: "friends" 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})
module.exports = mongoose.model('users', UserSchema)