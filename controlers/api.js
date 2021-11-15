const collections = require('./../database')

module.exports = {
	db: 'database',

	addLevels: (async function (req, res) {
			console.log(req.body)
	
			let { performanceLevels } = req.body
	
			performanceLevels = performanceLevels.map( level => {
				level.id = Date.now()
				return level
			})
	
			res.json({
				success: true,
				data: {
					performanceLevelsAdded: performanceLevels
				}
			})
		}).bind(this.db),

	getLevels: async (req, res) => {
		console.log('v2 GET /performance-levels')



		res.json({
			success: true,
			data: {
				performanceLevels: []
			}
		})
	}
}