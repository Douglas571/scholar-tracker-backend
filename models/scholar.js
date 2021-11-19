const mongoose = require('mongoose')

const scholarSchema = new mongoose.Schema({
  name: String,
  ronin: String,
  payRonin: String,

  history: [
    { date: String, slp: Number }
  ]
});

const Scholar = new mongoose.model('Scholar', scholarSchema)

module.exports = Scholar