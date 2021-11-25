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

// regex for validate ronins 
// /(?<start>((0x)|(ronin:)|()))(?<addrs>([(a-f)(0-9)]{2}){20})/gm
exports.updateScholars = async (scholars, perfmcLvls={}) => {
	let fetchedData = await this.fetchScholarsData(scholars)
	let upDt = this.setNewData(scholars, fetchedData)
	upDt = this.calculateScholarsPayments(upDt, perfmcLvls)

	return upDt
}

exports.fetchScholarsData = async (scholars) => {

	//console.log(`${JSON.stringify(scholars, null, 4)}`)
	//crear una cadena de texto con todas las ronin
	
	
	let roninList = scholars.map( sch => sch.ronin )
	const roninsStr = roninList.join(',')
	
	//consultar la api
	let { body } = await got(`https://game-api.axie.technology/api/v1/${roninsStr}`)
	let data = JSON.parse(body)

	let fetchedData = {}

	if (thereMultipleStats(data)) {
		fetchedData = data

	} else {

		fetchedData[roninList[0]] = data
		
	}

	return fetchedData
}

function thereMultipleStats(resived_API_info) {
	return !(resived_API_info.success)
}

function entryAlredyExist(scholar, newHistoryEntry) {
	let lastIdx = scholar.history.length - 1
	return ((scholar.history[lastIdx]["axie_timestamp"] !== newHistoryEntry["axie_timestamp"]))
}

function hasHistory(scholar) {
	return (scholar.history.length == 0)
}

function calculateSLPEarnedToday(scholar) {
	let lastIdx = scholar.history.length - 1
	if (scholar.history.length > 1) {

		const newLastIdx = scholar.history.length - 1
		let last = scholar.history[newLastIdx]
		let preLast = scholar.history[newLastIdx - 1]
	
		scholar.slp.today = last.slp - preLast.slp
		scholar.mmr.today = last.mmr - preLast.mmr
	}

	return scholar
}


exports.setNewData = (scholars, newData) => {
	let updatedScholars = []

	for(let ronin in newData) {
		let scholar = scholars.find( sch => sch.ronin === ronin)

		scholar.history = scholar.history || []
		scholar.slp = scholar.slp || {}
		scholar.mmr = scholar.mmr || {}
		
		let newHistoryEntry = { 
			axie_timestamp: newData[ronin]["cache_last_updated"],
			slp: newData[ronin]["in_game_slp"],
			mmr: newData[ronin]["mmr"]
		}

		//Determinar si colocar la nueva entrada
		let lastIdx = scholar.history.length - 1

		if (hasHistory(scholar) || 
			entryAlredyExist(scholar, newHistoryEntry)) {
			scholar.history.push(newHistoryEntry)			
		}

		scholar.slp.total = newData[ronin]["in_game_slp"]
		scholar.mmr.total = newData[ronin]["mmr"]
		scholar.last_claim = newData[ronin]['last_claim']
		scholar.next_claim = newData[ronin]['next_claim']

		//calcular el slp en un día, en torno al servidor principal
		scholar = calculateSLPEarnedToday(scholar)

		updatedScholars.push(scholar)
	}		

	console.groupEnd()

	//Retornar array de scholars
	return updatedScholars
}

//función para actualizar historial de slp y mmr
//Retorna: Mapa: ronin -> info
//Resive: Mapa: ronin -> info

//Resive una lista de becados y retorna sus datos calculados
exports.calculateScholarsPayments = (scholars, performanceLevels) => {
	let scholarsUpdatedInfo = []

	scholars.forEach( sch => {
		let schUpdatedInfo = JSON.parse(JSON.stringify(sch))

		if (schUpdatedInfo.history.length > 1) {

		} else {
			console.log(`Insuficient history entries for pay calculation :(`)
		}

		scholarsUpdatedInfo.push(schUpdatedInfo)
	})

	return scholarsUpdatedInfo

}

