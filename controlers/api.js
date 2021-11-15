const collections = require('./../database')

module.exports = {

	addLevels: async (req, res) => {
		const { db } = req.ctx

		let { performanceLevels } = req.body

		performanceLevels = performanceLevels.map( level => {
			level.id = Date.now()
			return level
		})

		db.collection('performance-levels').insertMany(JSON.parse(JSON.stringify(performanceLevels)))

		res.json({
			success: true,
			data: {
				performanceLevelsAdded: performanceLevels
			}
		})
	},

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
			data: {
				performanceLevels: results
			}
		})
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

	addScholar: async (req, res) => {
		let success = false

		const { db } = req.ctx 
		let { scholar } = req.body

		const result = await db.collection('scholars').insertOne(scholar)
		console.log('GET /scholars')
		console.log(result)

		if(result.insertedId) {
			res.json({
				success: true,
				scholar
			})	
		} else {
			res.json({
				success: false,
				message: 'some problems :('
			})	
		}

		
	},

	getScholars: async(req, res) => {
		res.json({})
	}
}