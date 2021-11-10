const scholars = new Map()

scholars.set('0x0', {
	name: 'Douglas',
	slp: 1400,
	mmr: 30,

	slpToPay: {

	},

	ronin: '0x0',
	roninForPay: '0x4238497',

	withdrawalDate: Date.now()
})

const performanceLevels = [
	{
		id: 1,
		level: 1,
		slp: {
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