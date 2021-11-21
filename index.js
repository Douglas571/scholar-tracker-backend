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

let init = async () => {

	let URL = ''
	if (['dev:online', 'production'].includes(process.env.NODE_ENV)) {
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

	
	let dbStr
	if(['test'].includes(process.env.NODE_ENV)) {
		dbStr = 'test'
	} else {
		dbStr = 'scholar-tracker'
	}

	let db = client.db(dbStr) 

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


	//Ejecutar cada 4 horas
		//updateScholarsData()
}

init()