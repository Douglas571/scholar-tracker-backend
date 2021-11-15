const express = require('express')
const API = require('./../controlers/api')

let ROUTER_API = express.Router()

ROUTER_API.post('/performance-levels', API.addLevels.bind({ hello: 'world'}))
ROUTER_API.get('/performance-levels', API.getLevels)

module.exports = ROUTER_API
