const got = require('got')

const { MongoClient } = require('mongodb')

const HOST = 'http://localhost:4000'
const DB = 'scholar-tracker'

describe('Testing /performance-levels endpoint', () => {
	beforeAll(() => {

	})

	it('A common operation, insert multiple levels and read', async () => {
		let level = {
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
		}

		//Testing an Error...
		let res = await got.post(`${HOST}/v2/performance-levels`, {
			json: {
				//performanceLevels: levels
			}
		}).json()

		expect(res).toEqual({
			success: false,
			message: "there's not any performance level"
		})


		//Rigth now, testing insertion...
		res = await got.post(`${HOST}/v2/performance-levels`, {
			json: {
				performanceLevel: level
			}
		}).json()
		expect(res.success).toEqual(true)
		let resivedLevel = res.performanceLevel

		expect(resivedLevel.id).toBeDefined()
		expect(resivedLevel.level).toBe(1)

		//Testing fetchin...
		res = await got(`${HOST}/v2/performance-levels`).json()
		expect(res.performanceLevels).toContainEqual(resivedLevel)

		//Testing delete operation...
		res = await got.delete(`${HOST}/v2/performance-levels/${resivedLevel.id}`)
		let newResults = await got(`${HOST}/v2/performance-levels`).json()

		//verifiying...
		expect(newResults.performanceLevels).not.toContainEqual(resivedLevel)

	})

	afterAll(async () => {
		const URL = 'mongodb://localhost:27017'
		const client = new MongoClient(URL)

		await client.connect()
		const db = client.db(DB)
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

		res = await got(`${HOST}/v2/scholars`).json()

		let { scholars } = res
		//expect(res.success).toBe(true)
		expect(scholars).toContainEqual(scholar)
		console.log(scholars)

		res = await got.delete(`${HOST}/v2/scholars/${scholar.ronin}`).json()
		expect(res.scholar).toMatchObject(scholar)

		res = await got(`${HOST}/v2/scholars`).json()
		expect(res.scholars).not.toContain(scholar)

		res = await got.put(`${HOST}/v2/scholars/${scholar2.ronin}`, {
			json: {
				scholar: {
					name: 'romina',
					discord: 'romina@7384'
				}
			}
		}).json()
		
		const newScholar = res.scholar

		expect(newScholar.name).toBe('romina')
		expect(newScholar.discord).toBe('romina@7384')

		res = await got(`${HOST}/v2/scholars`).json()
		expect(res.scholars).toContainEqual(newScholar)


	})

	afterAll(async () => {
		const URL = 'mongodb://localhost:27017'
		const client = new MongoClient(URL)

		await client.connect()
		const db = client.db(DB)
		db.collection('scholars').deleteMany()
	})
})


