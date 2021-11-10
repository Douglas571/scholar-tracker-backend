const scholars = new Map()
// https://game-api.axie.technology/api/v1/0xaf972caf000306230f3e482bb408a0d488fd7676,0xfbd406d3c61e21916f6ed28a7376848b8b4533be,0x9ed2ae82b193ec4c739fec19e71940c0362d2b21,0x31677f7abdc49c6c170b77cdffe536ec1ddbc70c
scholars.set('0xaf972caf000306230f3e482bb408a0d488fd7676', {
	name: 'Douglas',
	slp: 1400,
	mmr: 30,

	slpToPay: {

	},

	roninForPay: '0x4238497',
})

scholars.set('0xfbd406d3c61e21916f6ed28a7376848b8b4533be', {
	name: 'Top #1',
	slp: 5000,
	mmr: 1300,
})

scholars.set('0x9ed2ae82b193ec4c739fec19e71940c0362d2b21', {
	name: 'Top #2',
	slp: 3400,
})

scholars.set('0x31677f7abdc49c6c170b77cdffe536ec1ddbc70c', {
	name: 'Top #3',
	slp: 2300,
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
	{
		id: 2,
		level: 2,
		slp: {
			bottom: 1500,
			top: 2500
		},
		percentage: {
			scholar: 25,
			manager: 30,
			investor: 45
		}
	},
	{
		id: 3,
		level: 3,
		slp: {
			bottom: 2500,
			top: 3500
		},
		percentage: {
			scholar: 35,
			manager: 30,
			investor: 35
		}
	},
	{
		id: 4,
		level: 4,
		slp: {
			bottom: 3500,
			top: 4500
		},
		percentage: {
			scholar: 40,
			manager: 30,
			investor: 30
		}
	},
]

module.exports = {
	performanceLevels,
	scholars
}