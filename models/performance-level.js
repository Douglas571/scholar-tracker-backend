const mongoose = require('mongoose')
const performanceLevelSchema = new mongoose.Schema({
	level: Number,
	ranges: [
		order: Number,
		slp: Number,
		percentage: {
			scholar: Number,
			manager: Number,
			investor: Number
		}
	]
})

const PerformanceLevel = new mongoose.model('PerformanceLevel', performanceLevelSchema);

module.exports = PerformanceLevel