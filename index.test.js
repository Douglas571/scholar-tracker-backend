const got = require('got')

const { MongoClient } = require('mongodb')

const HOST = 'http://localhost:4000'

describe('Testing /performance-levels endpoint', () => {
	beforeAll(() => {

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

		//----------------------------------------------

		res = await got(`${HOST}/v2/performance-levels`).json()

		expect(res.data.performanceLevels).toContainEqual(resivedLevels[0])

		res = await got.delete(`${HOST}/v2/performance-levels/${resivedLevels[0].id}`)
		let newResults = await got(`${HOST}/v2/performance-levels`).json()

		expect(newResults.data.performanceLevels).not.toContainEqual(resivedLevels[0])

	})

	afterAll(async () => {
		const URL = 'mongodb://localhost:27017'
		const client = new MongoClient(URL)

		await client.connect()
		const db = client.db('scholar-tracker')
		db.collection('performance-levels').deleteMany()

	})
})

describe('Testing /scholars endpoint', () => {
	it('A common operation, create, get and delete a scholar', async () => {
		let scholar = {
			ronin: '0x000000',
			payronin: '0x000000',
			name: 'test',
			discord: 'test@1234',
			level: 1
		}

		let res = await got.post(`${HOST}/v2/scholars`, {
			json: {
				scholar 
			}
		}).json()

		let resivedScholar = res.scholar
		expect(res.success).toBe(true)
		expect(resivedScholar.ronin).toEqual(scholar.ronin)



		//---------------- getting ----------------------------
		let scholar2 = {
			ronin: '0x100000',
			payronin: '0x000000',
			name: 'test2',
			discord: 'test@1333',
			level: 2
		}

		await got.post(`${HOST}/v2/scholars`, {
			json: {
				scholar: scholar2
			}
		})

		res = await got(`${HOST}/v2/scholar`).json()

		let { scholars } = res
		expect(res.success).toBe(true)
		expect(scholars).toContain(scholar)


	})

	afterAll(async () => {
		const URL = 'mongodb://localhost:27017'
		const client = new MongoClient(URL)

		await client.connect()
		const db = client.db('scholar-tracker')
		db.collection('scholars').deleteMany()

	})
})


