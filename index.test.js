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
		})

		console.log(res)

		let data = res.json()
		expect(data).toEqual({ 
			success: true
		})
	})

	afterAll(() => {
		console.log('Teardown data')
	})
})


