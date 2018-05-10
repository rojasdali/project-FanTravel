const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const User = require('./user.js')

const commentSchema = new Schema({
  email: String,
  gameId: String,
  userId: {type:  Schema.Types.ObjectId, ref: "User"},
  text: String,
  isOwner: {type: Boolean, default: false}
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;