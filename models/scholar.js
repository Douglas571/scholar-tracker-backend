const mongoose = require('mongoose')

const scholarSchema = new mongoose.Schema({
  name: String,
  level: Number,
  ronin: String,
  payToRonin: String,

  discord: String,

  slp: {
    total: Number,
    today: Number
  },

  mmr: Number,

  history: [
    { date: String, slp: Number, mmr: Number }
  ]

});

const Scholar = new mongoose.model('Scholar', scholarSchema)

module.exports = Scholar