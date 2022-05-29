const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postid: { 
        type: Schema.Types.ObjectId, 
        ref: "posts",
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId, 
        ref: "users",
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model("comments", commentSchema);
