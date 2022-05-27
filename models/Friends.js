const mongoose = require('mongoose')
const Schema =mongoose.Schema

const FriendSchema = new Schema({
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    friends: [
        {
            friend_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true,
                unique: true
            },
            status_follow: {
                type: Number,
                default: 0, 
            },
        }
    ]
    
}, {timestamps: true})
module.exports = mongoose.model('friends', FriendSchema)