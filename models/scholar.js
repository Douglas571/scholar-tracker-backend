const mongoose = require('mongoose')

const scholarSchema = new mongoose.Schema({
  name: String,
  level: Number,
  ronin: String,
  payToRonin: String,

  discord: String,

  slp: Number,
  mmr: Number,

  history: [
    { date: String, slp: Number }
  ]

});

const Scholar = new mongoose.model('Scholar', scholarSchema)

module.exports = Scholar