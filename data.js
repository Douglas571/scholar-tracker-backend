const scholars = new Map()

scholars.set('0x0', {
	name: 'Douglas',
	SLP: 1400,
	MMR: 30,

	withdraw: Date.now()
})

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