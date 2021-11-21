/*
	Necesito:
	  - función para extraer datos de la Ronin Chain
	  - función para actualizar historial de slp y mmr
	  - función para calcular pagos del día
*/

//función para extraer datos de la Ronin Chain
//Retorna: Mapa: ronin -> scholar
//Recive: Mapa: ronin -> scholar
async function updateScholarsData(scholars) {
	console.group('Libs - updateScholarsData')

	//crear una cadena de texto con todas las ronin
	let roninsStr = scholars.forEach( sch => sch.ronin ).join(',')
	console.log(roninsStr)
	
	//consultar la api
	let { body } = await got(`https://game-api.axie.technology/api/v1/${roninsStr}`)
	let data = JSON.parse(body)
	console.log(`The resived data is: ${JSON.stringify(data, null, 4)}`)
	console.log('end fetching')

	//mapear el resultado y guardar en "Scholars"

	/*
	for(let ronin in data) {
		let scholar = DATA.scholars.get(ronin)
		console.log(scholar)
		let scholarOrigin = data[ronin]

		scholar.gameName = scholarOrigin.name
		scholar.slp = scholarOrigin['in_game_slp']
		scholar.mmr = scholarOrigin.mmr
		scholar.nextClaim = scholarOrigin['next_claim']

		DATA.scholars.set(ronin, scholar)
	}
	*/

	

	console.log(DATA.scholars)

	console.groupEnd()

	//Retornar array de scholars
}

//función para actualizar historial de slp y mmr
//Retorna: Mapa: ronin -> info
//Resive: Mapa: ronin -> info

//Resive una lista de becados y retorna sus datos calculados
function calculatePayments() {
	//mapear cada uno de los becados
	console.group('Index.js - calculatePayments')
	console.log('prev scholars:')
	console.log(DATA.scholars)

	let newScholars = new Map()
	DATA.scholars.forEach((scholar, ronin) => {
		console.log('PREV scholar')
		console.log(scholar)

		scholar.slpToPay = {}

		DATA.performanceLevels.forEach( level => {
			let { slp } = scholar
			if ((slp >= level.slp.bottom) && (slp < level.slp.top)) {
				let slpToHimself = (slp * level.percentage.scholar) / 100
				let slpToManager = (slp * level.percentage.manager) / 100
				let slpToInv = (slp * level.percentage.investor) / 100

				scholar.performance = level.level
				scholar.percent = level.percentage.scholar

				scholar.slpToPay = {
					self: slpToHimself,
					manager: slpToManager,
					investor: slpToInv
				}

				console.log('total: ', (slpToHimself + slpToManager + slpToInv))
			}
		})

		console.log('FINAL scholar')
		console.log(scholar)
		console.log()
	})
	//calcular pagos
	//almacenar datos en "Scholars"
	console.log('final scholars:')
	console.log(DATA.scholars)
}

