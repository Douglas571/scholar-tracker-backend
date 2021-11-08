require('dotenv').config()
const express = require('express')

const APP = express()

let { PORT } = process.env

PORT = PORT || 3000

APP.get('/', (req, res) => {

	res.send(`<h1>Hola londoño</h1>\n${JSON.stringify(process.env, null, 4)}`)
	res.end()
})

APP.listen(PORT, (err) => {
	console.log(`Listing in: localhost:${PORT}`)
})
