const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  team: Object,
  city: String,
  airport: String,
  comments: Array,
  //avatar: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
