const got = require('got')

/*
	Necesito:
	  - función para extraer datos de la Ronin Chain
	  - función para actualizar historial de slp y mmr
	  - función para calcular pagos del día
*/

//función para extraer datos de la Ronin Chain
//Retorna: Mapa: ronin -> scholar
//Recive: Mapa: ronin -> scholar
exports.fetchScholarsData = async (scholars) => {
	let scholarsFetchedInfo = []

	console.group('Libs - updateScholarsData')

	//crear una cadena de texto con todas las ronin
	
	
	let roninsStr = scholars.map( sch => sch.ronin ).join(',')
	console.log(roninsStr)
	
	//consultar la api
	
	let { body } = await got(`https://game-api.axie.technology/api/v1/${roninsStr}`)
	let data = JSON.parse(body)
	console.log(`The resived data is: ${JSON.stringify(data, null, 4)}`)
	console.log('end fetching')	

	//mapear el resultado y guardar en "Scholars"

	for(let ronin in data) {
		let scholar = scholars.find( sch => sch.ronin === ronin)
		//console.log(scholar)
		/*
			let scholarOrigin = data[ronin]

			scholar.gameName = scholarOrigin.name
			scholar.slp = scholarOrigin['in_game_slp']
			scholar.mmr = scholarOrigin.mmr
			scholar.nextClaim = scholarOrigin
		*/

		scholar.history = scholar.history || []
		scholar.slp = scholar.slp || {}
		scholar.mmr = scholar.mmr || {}
		console.log(`the history length is: ${JSON.stringify(scholar.history.length, null, 4)}`)

		let lastIdx = scholar.history.length - 1
		
		let newHistoryEntry = { 
			axie_timestamp: data[ronin]["cache_last_updated"],
			slp: data[ronin]["in_game_slp"],
			mmr: data[ronin]["mmr"]
		}

		if ((scholar.history.length == 0) || ((scholar.history[lastIdx]["axie_timestamp"] !== newHistoryEntry["axie_timestamp"]))) {
			scholar.history.push(newHistoryEntry)			
		}

		// si el historila no tiene datos, agregar entrada
		//

		scholar.slp.total = data[ronin]["in_game_slp"]
		scholar.mmr.total = data[ronin]["mmr"]
		scholar.next_claim = data[ronin]['next_claim']

		scholarsFetchedInfo.push(scholar)
	}

	console.groupEnd()

	//Retornar array de scholars
	return scholarsFetchedInfo
}

//función para actualizar historial de slp y mmr
//Retorna: Mapa: ronin -> info
//Resive: Mapa: ronin -> info

//Resive una lista de becados y retorna sus datos calculados
exports.calculateScholarsPayments = (scholars, performanceLevels) => {
	let scholarsUpdatedInfo = []
	console.group('Libs - calculate payments')

	console.log(`the scholars are: ${JSON.stringify(scholars, null, 4)}`)
	console.log(`the performanceLevels are: ${JSON.stringify(performanceLevels, null, 4)}`)

	scholars.forEach( sch => {
		let schUpdatedInfo = JSON.parse(JSON.stringify(sch))

		if (schUpdatedInfo.history.length > 1) {

		} else {
			console.log(`Insuficient history entries for pay calculation :(`)
		}

		scholarsUpdatedInfo.push(schUpdatedInfo)
	})

	console.groupEnd()

	return scholarsUpdatedInfo

}

