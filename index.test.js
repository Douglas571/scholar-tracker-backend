const got = require('got')

const HOST = 'http://localhost:4000'

describe('/performance-levels', () => {
	beforeAll(() => {
		console.log('Setup data')
	})

	it('A common operation, insert multiple levels and read', async () => {
		let levels = [
			{
				level: 1,
				ranges: [
					{
						order: 1,
						slp: {
							bottom: 0,
							top: 75,
						},
						percentage: {
							sholar: 0,
							manager: 30,
							investor: 70,
						}
					},
					{
						order: 2,
						slp: {
							bottom: 75,
							top: 130	
						},
						percentage: {
							sholar: 20,
							manager: 20,
							investor: 60
						}
					}
				]
			},

		]

		let res = await got.post(`${HOST}/v2/performance-levels`, {
			json: {
				performanceLevels: levels
			}
		}).json()

		expect(res.success).toEqual(true)

		let resivedLevels = res.data.performanceLevelsAdded

		expect(resivedLevels[0].id).toBeDefined()
		expect(resivedLevels[0].level).toBe(1)

		res = await got(`${HOST}/v2/performance-levels`).json()

		expect(res.data.performanceLevels).toEqual(resivedLevels)

	})

	afterAll(() => {
		console.log('Teardown data')
	})
})


