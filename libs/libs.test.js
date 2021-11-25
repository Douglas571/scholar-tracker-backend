const libs = require('./index')

describe('Libs', () => {
	it.only('updating one scholar', async () => {
		const scholars = [
			{
				"name": "María",
        		"ronin": "0xaf972caf000306230f3e482bb408a0d488fd7676"
			}/*,
			{
				"name": "Top #1",
        		"ronin": "0xfbd406d3c61e21916f6ed28a7376848b8b4533be"
			}*/
		]

		const updatedScholars = await libs.updateScholars(scholars)

		expect(updatedScholars.length).toBe(1)
		expect(updatedScholars[0].history).toBeDefined()
		expect(updatedScholars[0].history.length).toBe(1)

		expect(updatedScholars[0].slp.total).toBeDefined()
		expect(updatedScholars[0].mmr.total).toBeDefined()
	})
})