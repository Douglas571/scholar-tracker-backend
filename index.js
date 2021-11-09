require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const DATA = require('./data')

const APP = express()

let PORT = process.env.PORT || 3001

APP.use(bodyParser.json())
APP.use(cors())

APP.get('/performance-levels', (req, res) => {
	console.log('APP - GEP - /performance-levels ')

	let lastLevel = DATA.performanceLevels[DATA.performanceLevels.length - 1]
	let nextMinSLP = 0

	if (lastLevel) {
		nextMinSLP = lastLevel.SLP.top
	}

	res.json({
		performanceLevels: DATA.performanceLevels,
		nextMinSLP
	})
})

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
	performanceLevel.id = Date.now()

	if (process.env.DEBUG == 'deep') {
		console.log(performanceLevel)
	}

	DATA.performanceLevels.push(performanceLevel)

	res.json({ performanceLevels: DATA.performanceLevels })
})

APP.delete('/performance-levels/:id', (req, res) => {
	console.log('APP - DELETE - performance-levels')
	const { id } = req.params
	console.log('id: ', id)

	DATA.performanceLevels = DATA.performanceLevels.filter( level => level.id != id)

	let success = true

	res.json({
		success,
		performanceLevels: DATA.performanceLevels
	})
})

APP.route('/scholars')
	.post((req, res) => {
		console.log('APP - GET - /scholars')
		console.log(req.body)

		const scholar = req.body.scholar

		let success = true
		res.json({ success, scholars: DATA.scholars })
	})

APP.get('/', (req, res) => {
	res.end(`<h1>Hello World!</h1>`)
})

APP.listen(PORT, (err) => {
	console.log(`Listing in: localhost:${PORT}`)
})
