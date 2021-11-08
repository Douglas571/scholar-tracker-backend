require('dotenv').config()
const express = require('express')

const APP = express()

let { PORT } = process.env

PORT = PORT || 3000

APP.get('/', (req, res) => {

	res.send(`<h1>Hola Victor</h1>`)
	res.end()
})

APP.listen(PORT, (err) => {
	console.log(`Listing in: localhost:${PORT}`)
})
