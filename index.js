// scholar-tracker-backend

// scholar-tracker-frontend
// heroku create scholar-tracker-frontend --buildpack mars/create-react-app


//require('dotenv').config()
const { MongoClient } = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const got = require('got')

const DATA = require('./data')
const ROUTER_API_V2 = require('./routers/api-v2')

const APP = express()

let PORT = process.env.PORT || 3001

APP.use(bodyParser.json())
APP.use(cors())

APP.get('/', (req, res) => {
	res.end(`<h1>Hello World!</h1>`)
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

	calculatePayments()
}

function calculatePayments() {
	//mapear cada uno de los becados
	console.group('Index.js - calculatePayments')
	console.log('prev scholars:')
	console.log(DATA.scholars)

	let newScholars = new Map()
	DATA.scholars.forEach((scholar, ronin) => {
		console.log('PREV scholar')
		console.log(scholar)

		scholar.slpToPay = {}

		DATA.performanceLevels.forEach( level => {
			let { slp } = scholar
			if ((slp >= level.slp.bottom) && (slp < level.slp.top)) {
				let slpToHimself = (slp * level.percentage.scholar) / 100
				let slpToManager = (slp * level.percentage.manager) / 100
				let slpToInv = (slp * level.percentage.investor) / 100

				scholar.performance = level.level
				scholar.percent = level.percentage.scholar

				scholar.slpToPay = {
					self: slpToHimself,
					manager: slpToManager,
					investor: slpToInv
				}

				console.log('total: ', (slpToHimself + slpToManager + slpToInv))
			}
		})

		console.log('FINAL scholar')
		console.log(scholar)
		console.log()
	})
	//calcular pagos
	//almacenar datos en "Scholars"
	console.log('final scholars:')
	console.log(DATA.scholars)
}

(async () => {



	let URL = ''
	if (process.env.NODE_ENV === 'dev:online') {
		URL = process.env.DB_URL
		console.log(`Connecting to Mongo Atlas in: ${URL}`)

	} else {
		URL = 'mongodb://localhost:27017'
		console.log(`Connecting to local MongoDB...`)

	}

	const client = new MongoClient(URL)

	while(true) {
		try {
			await client.connect()
			console.log(`Connection successfull`)
			break

		} catch (err) {
			console.log('connection error!!')
			console.log(`${err}`)
		}
	}

	const db = client.db('scholar-tracker')

	APP.use((req, res, next) => {
		console.log('seting context')

		req.ctx = {
			db
		}

		next()
	})

	APP.use('/v2', ROUTER_API_V2)

	APP.listen(PORT, (err) => {
		console.log(`Listing in: localhost:${PORT}`)
	})


	//updateScholarsData()
})();