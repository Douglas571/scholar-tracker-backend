const scholars = new Map()

const performanceLevels = [
	{
		id: 1,
		level: 1,
		SLP: {
			bottom: 0,
			top: 1500
		},
		percentage: {
			scholar: 20,
			manager: 30,
			investor: 50
		}
	},

]

module.exports = {
	performanceLevels,
	scholars
}