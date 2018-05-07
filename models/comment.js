const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  gameId: String,
  userId: String,
  text: String
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Comment = mongoose.model("Game", commentSchema);

module.exports = Comment;