const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const User = require('./user.js')

const commentSchema = new Schema({
  gameId: String,
  userId: {type:  Schema.Types.ObjectId, ref: "User"},
  text: String
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;