// scholar-tracker-backend

// scholar-tracker-frontend
// heroku create scholar-tracker-frontend --buildpack mars/create-react-app


//require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const got = require('got')

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
		nextMinSLP = lastLevel.slp.top
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
	.get((req, res) => {
		/* format
			
			scholars [
				{
					ronin
					name
					slp
					mmr

					withdrawalDate

				}
			]
		*/

		let scholars = []

		DATA.scholars.forEach((scholar, ronin) => {
			scholars.push(scholar)
		})

		res.json({ scholars })
	})
	.post((req, res) => {
		/* format

			scholar {
				name
				ronin
				roninForPay
			}
	
		*/

		console.group('APP - POST - /scholars')
		console.log(req.body)

		const scholar = req.body.scholar

		scholar.slpToPay = {}

		DATA.scholars.set(scholar.ronin, scholar)

		let success = true

		console.groupEnd()
		res.json({ success, scholars: Object.fromEntries(DATA.scholars) })
	})

APP.get('/', (req, res) => {
	res.end(`<h1>Hello World!</h1>`)
})

APP.listen(PORT, (err) => {
	console.log(`Listing in: localhost:${PORT}`)
})

//------------------------------------------------------

async function updateScholarsData() {
	console.group('Index.js - updateScholarsData')
	//crear una cadena de texto con todas las direcciones
	let roninList = []

	DATA.scholars.forEach((_, ronin) => {
		roninList.push(ronin)
	})

	let roninStringChain = roninList.join(',')
	console.log(roninStringChain)
	//consultar la api

	let { body } = await got(`https://game-api.axie.technology/api/v1/${roninStringChain}`)
	let data = JSON.parse(body)
	console.log(data)

	console.log('end fetching')

	//mapear el resultado y guardar en "Scholars"
	for(let ronin in data) {
		let scholar = DATA.scholars.get(ronin)
		console.log(scholar)
		let scholarOrigin = data[ronin]

		scholar.gameName = scholarOrigin.name
		scholar.slp = scholarOrigin['in_game_slp']
		scholar.mmr = scholarOrigin.mmr
		scholar.nextClaim = scholarOrigin['next_claim']

		DATA.scholars.set(ronin, scholar)
	}

	console.log(DATA.scholars)

	console.groupEnd()
}

async function calculatePayments() {
	//mapear cada uno de los becados

	//calcular pagos
	//almacenar datos en "Scholars"
}

(async () => {
	//updateScholarsData()
	calculatePayments()
})();