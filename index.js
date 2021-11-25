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
const libs = require('./libs')

const APP = express()

let PORT = process.env.PORT || 3001

APP.use(bodyParser.json())
APP.use(cors())

APP.get('/updt', async (req, res) => {
	console.group(`APP - route: update`)
	
	try {
		await updateScholarsData(req.ctx.db)	
		res.json({ success: true })
	} catch (err) {
		res.end(JSON.stringify(err, null, 4))
	}
	
	console.groupEnd()
	
	
})

APP.get('/', (req, res) => {
	res.end(`<h1>Hello World!</h1>`)
})


//------------------------------------------------------

async function updateScholarsData(db) {
	console.group(`APP - updating scholars data`)
	
	try {
		let scholars = await db.collection('scholars').find({}).toArray()
		console.log(`scholars: ${JSON.stringify(scholars, null, 4)}`)

		let scholarsFetchedInfo = await libs.fetchScholarsData(scholars)
		let performanceLevels = await db.collection('performance-levels').find({}).toArray()
		let scholarsUpdatedInfo = libs.calculateScholarsPayments(scholarsFetchedInfo, performanceLevels)
		
		console.log(`final sholars updated info: ${JSON.stringify(scholarsUpdatedInfo, null, 4)}`)
		
		scholarsUpdatedInfo.forEach( async scholar => {
			let result = await db.collection('scholars').updateOne({_id: scholar._id}, { '$set': scholar }, { upsert: true })
			console.log(`the result is: ${JSON.stringify(result, null, 4)}`)
		})

	} catch (err) {
		console.log(err)
	}
	
	console.groupEnd()
	
}

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

	console.log(`Using "${dbStr}" db`)
	let db = client.db(dbStr) 

	APP.use((req, res, next) => {
		console.log('seting context')

		req.ctx = {
			db
		}

		next()
	})

	APP.use('/v2', ROUTER_API_V2)

	await APP.listen(PORT)
	console.log(`Listing in: localhost:${PORT}`)


	//Ejecutar cada 4 horas
		//updateScholarsData()
	console.group(`MAIN - Updated scholars`)

	await updateScholarsData(db)
	
	console.log(`Update finished...`)
	console.groupEnd()	

	//guardar los datos actualiados en la base de datos, collection scholars
}

init()