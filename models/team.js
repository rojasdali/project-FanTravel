const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const teamSchema = new Schema({
  city: String,
  name: String,
  abbr: String,
  airport: String,
  logo: String,
  schedule: Array
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
