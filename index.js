// require('dotenv').config()
const { MongoClient } = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const ROUTER_API_V2 = require('./routers/api-v2')
const libs = require('./libs')

const APP = express()

const PORT = process.env.PORT || 3001

APP.use(bodyParser.json())
APP.use(cors())

APP.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1>')
})

// ------------------------------------------------------

async function updateScholarsData (db) {
  console.group('APP - updating scholars data')

  try {
    const scholars = await db.collection('scholars').find({}).toArray()
    console.log(`scholars: ${JSON.stringify(scholars, null, 4)}`)

    const perfmLvl = await db.collection('performance-levels').find({}).toArray()
    let updatedScholars = await libs.updateScholars(scholars, perfmLvl)

    console.log(`final sholars updated info: ${JSON.stringify(updatedScholars, null, 4)}`)

    updatedScholars.forEach(async scholar => {
      const result = await db.collection('scholars').updateOne({ _id: scholar._id }, { $set: scholar }, { upsert: true })
      console.log(`the result is: ${JSON.stringify(result, null, 4)}`)
    })
    
  } catch (err) {
    console.log(err)
  }

  console.groupEnd()
}

const init = async () => {
  let URL = ''
  if (['dev:online', 'production'].includes(process.env.NODE_ENV)) {
    URL = process.env.DB_URL
    console.log(`Connecting to Mongo Atlas in: ${URL}`)
  } else {
    URL = 'mongodb://localhost:27017'
    console.log('Connecting to local MongoDB...')
  }

  const client = new MongoClient(URL)

  while (true) {
    try {
      await client.connect()
      console.log('Connection successfull')
      break
    } catch (err) {
      console.log('connection error!!')
      console.log(`${err}`)
    }
  }

  let dbStr
  if (['test'].includes(process.env.NODE_ENV)) {
    dbStr = 'test'
  } else {
    dbStr = 'scholar-tracker'
  }

  console.log(`Using "${dbStr}" db`)
  const db = client.db(dbStr)

  APP.use((req, res, next) => {
    console.log('seting context')

    req.ctx = {
      db
    }

    next()
  })

  APP.get('/updt', async (req, res) => {
	  console.group('APP - route: update')

	  try {
	    await updateScholarsData(req.ctx.db)
	    res.json({ success: true })
	  } catch (err) {
	  	console.log(err)
	    res.end(JSON.stringify(err, null, 4))
	  }

	  console.groupEnd()
	})

  APP.use('/v2', ROUTER_API_V2)

  await APP.listen(PORT)
  console.log(`Listing in: localhost:${PORT}`)

  console.groupEnd()
}

init()
