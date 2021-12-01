async function findScholar(db, filter, options) {
	options = { projection: { _id: 0 }}
	let scholar = await db.collection('scholars')
						  .findOne(filter, options)
	return scholar
}

async function getAllScholars(db, filter={}, options={}) {
	options = options || { projection: { _id: 0 }}
	results = await db.collection('scholars')
					  .find(filter, options)
				   	  .toArray()
	return results
}

module.exports = {
	getLevels: async (req, res) => {
		console.log('v2 GET /performance-levels')

		const { db } = req.ctx

		let cursor = await db.collection('performance-levels').find({})
		let results = await cursor.toArray()

		results = results.map( level => {
					level._id = undefined
					return level
				})

		console.log(results)

		res.json({
			success: true,
			performanceLevels: results
		})
	},

	addLevel: async (req, res) => {
		const { db } = req.ctx
		let { performanceLevel } = req.body

		if (performanceLevel) {
			performanceLevel.id = Date.now()

			await db.collection('performance-levels').insertOne(JSON.parse(JSON.stringify(performanceLevel)))
			const savedPerfLevel = await db.collection('performance-levels').findOne({id: performanceLevel.id})
			savedPerfLevel._id = undefined

			res.json({
				success: true,
				performanceLevel: savedPerfLevel
			})
		} else {
			res.json({
				success: false,
				message: "there's not any performance level"
			})
		}

		
	},

	deleteLevel: async (req, res) => {

		let success
		let id = Number(req.params.id)
		let { db } = req.ctx		

		console.log(`DELETE performance-levels ${id}`)

		let filtering = await db.collection('performance-levels').findOne({ id })
		console.log(filtering)

		let results = await db.collection('performance-levels').deleteOne({ id })
		console.log(results)

		res.json({
			success
		})	
	},

	getScholars: async(req, res) => {
		const { db } = req.ctx
		let results = await getAllScholars(db)

		console.group(`API - get Scholars`)

		console.log(results)

		console.groupEnd()

		res.json({ scholars: results })
	},

	addScholar: async (req, res) => {
		let success = false

		const { db } = req.ctx 

		console.log(req.body)

		let { scholar } = req.body

		if (scholar) {
			
			try {
				const result = await db.collection('scholars').insertOne(scholar)
				console.log('POST /scholars')
				console.log(result)

				res.json({
					success: true,
					scholar
				})

			} catch (err) {
				console.log(err)
				if(err.code === 11000){
					res.json({
						success: false,
						msg: 'duplicate ronin'
					})
				}
			}
		} else {
			res.json({
				success: false,
				msg: `There's not scholar :(`
			})	
		}
	},

	setScholar: async (req, res) => {
		const ronin = req.params.ronin
		const newData = req.body.scholar
		const { db } = req.ctx

		//TO-DO: Validate data		

		console.group(`API - set scholar`)
		
		try {
			//optener el becado
			let filter = { ronin }
			let scholar = await findScholar(db, filter)
			console.log(`the scholar is: ${JSON.stringify(scholar, null, 4)}`)

			//unir la info de los becados
			scholar = {...scholar, ...newData}

			console.log(`now, the scholar is: ${JSON.stringify(scholar, null, 4)}`)

			//guardar becado
			const result = await db.collection('scholars').updateOne(
				{ ronin: scholar.ronin },
				{ $set: scholar })

			//enviar json
			res.json({
				success: true,
				scholar
			})

		} catch (err) {
			console.log(err)
			res.json({
				success: false,
				msg: err
			})
		}	
		
		console.groupEnd()
		
	},

	deleteScholar: async (req, res) => {
		const ronin = req.params.ronin
		const { db } = req.ctx

		//TO-DO: Verify that is valid ronin

		console.group(`API - delete scholar`)
		
		try {

			const scholar = await findScholar(db, { ronin })
			const result = await db.collection('scholars').deleteOne({ ronin: scholar.ronin })

			console.log(`The result: ${JSON.stringify(result, null, 4)}`)
			
			res.json({
				success: true,
				scholar
			})

		} catch (err) {
			console.log(err)
			res.json({
				success: false,
				msg: err,
				scholar: {}
			})
		}
		
		console.groupEnd()

	},

	markScholar: async (req, res) => {
		console.log('marking...')
		const { db } = req.ctx
		const { ronin } = req.params
		const { newEntry } = req.body

		// buscar el becado
		const scholar = await findScholar(db, { ronin })

		if (newEntry) {
			// si mando una entrada, agregar entrada marcada
			// TO-DO: Verificar nueva entrada
			scholar.history.push(newEntry)

		} else {
			// si no, marcar la utlima entrada
			let lastIdx
			if(scholar.history) {
				lastIdx = scholar.history.length - 1
			}
			scholar.history[lastIdx]['end_day'] = true
				
		}
		
		try {
			// actualizar becado
			const result = await db.collection('scholars').updateOne({ ronin: scholar.ronin }, { $set: scholar })

			res.json({
				success: true,
				scholar
			})

		} catch (err) {
			console.log(err)
			res.json({
				success: false,
				msg: err
			})
		}
	}
}