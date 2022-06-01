const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const repCommentSchema = new Schema({
    commentid: { 
        type: Schema.Types.ObjectId, 
        ref: "comments",
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
module.exports = mongoose.model("repcomments", repCommentSchema);
