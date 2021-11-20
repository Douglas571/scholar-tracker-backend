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
		let results

		results = await req.ctx.db.collection('scholars').find({}).toArray()
		console.group(`API - get Scholars`)
		
		console.log(`The scholars are: ${JSON.stringify(results, null, 4)}`)

		console.groupEnd()
		results.forEach( scholar => scholar._id = undefined)
		

		res.json({ scholars: results })
	},

	addScholar: async (req, res) => {
		let success = false

		const { db } = req.ctx 

		console.log(req.body)

		let { scholar } = req.body

		if (scholar) {
			const result = await db.collection('scholars').insertOne(scholar)
			console.log('POST /scholars')
			console.log(result)

			if(result.insertedId) {
				res.json({
					success: true,
					scholar
				})
			}
		} else {
			res.json({
				success: false,
				message: `There's not scholar :(`
			})	
		}
	},

	setScholar: async (req, res) => {
		let success = false
		let message = ''

		

		res.json({
			success,
			message,
		})
	}
}