const mongoose = require("mongoose");

const PlayerModelSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    score: Number,
    suscribed: Boolean
});

module.exports = {
  PlayerModel: mongoose.model("player", PlayerModelSchema),
};