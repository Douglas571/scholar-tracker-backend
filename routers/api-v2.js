const express = require('express')
const API = require('./../controlers/api')

let ROUTER_API = express.Router()

ROUTER_API.delete('/performance-levels/:id', API.deleteLevel)
ROUTER_API.post('/performance-levels', API.addLevels)
ROUTER_API.get('/performance-levels', API.getLevels)

ROUTER_API.post('/scholars', API.addScholar)
ROUTER_API.get('/scholars', API.getScholars)

module.exports = ROUTER_API
