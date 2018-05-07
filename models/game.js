const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const gameSchema = new Schema({
  home: String,
  logo: String,
  away: String,
  week: Number,
  date: String,
  day: String,
  time: String,
  tickets: String
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;