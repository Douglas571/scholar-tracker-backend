require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const DATA = require('./data')

const APP = express()

let PORT = process.env.PORT || 3001

APP.use(bodyParser.json())
APP.use(cors())

APP.post('/performance-levels', (req, res) => {
	/* format
		performanceLevel {
			slp {
				bottom
				top
			}

			percentage {
				sholar
				manager
				investor
			}
		}

	*/
	console.log('Index.js - POST - /performance-levels')

	let { performanceLevel } = req.body

	if (process.env.DEBUG == 'deep') {
		console.log(performanceLevel)
	}

	DATA.performanceLevel.push(performanceLevel)

	res.json({ performanceLevel })

})

APP.get('/', (req, res) => {
	res.end(`<h1>Hello World!</h1>`)
})

APP.listen(PORT, (err) => {
	console.log(`Listing in: localhost:${PORT}`)
})
