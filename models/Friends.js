const mongoose = require('mongoose')
const Schema =mongoose.Schema

const FriendSchema = new Schema({
    ownerid: {
        type: String,
        required: true
    },
    friends: [
        {
            id_friend: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true 
            },
            status_follow: {
                type: Number,
                default: 1, 
            },
        }
    ]
    
}, {timestamps: true})
module.exports = mongoose.model('friends', FriendSchema)