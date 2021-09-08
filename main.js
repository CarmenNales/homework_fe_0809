const API_URL = `https://restcountries.eu/rest/v2`

async function getDataOfCountry(countryName = '') {

    try {

        // Call API om deze te gebruiken
        const api_call = `${API_URL}/name/${countryName}`
        console.log('Calling ', api_call)
        const result = await axios(api_call)
        console.log('Response: ', result)

        // Destructure de data om deze te gebruiken
        const {data, status} = result

        // Controleer of alles goed gegaan is
        if (status !== 200) throw `Status was ${status}, reason: ${data}`

        return data[0]

    } catch (e) {
        console.error('API ERROR: ', e)
        throw `The getDataOfCountry function broke with: ${e}`
    }

}

// ---------------------------------------------------------

// Functie om alle 'currencies' uit het object te halen
function getCurrencies(currencies) {

    // Loop door de currencies en zet deze in een variabele
    let displayCurrencies = currencies.map(a => a.name)

    // Controleren of deze 1 currency bevat, zoja: return
    if (displayCurrencies.length === 1) {
        return displayCurrencies[0]
    }

    // Controleren of deze 2 currencies bevat, zoja: return
    if (displayCurrencies.length === 2) {
        return displayCurrencies[0] + " and " + displayCurrencies[1]
    }

    // Indien deze meer dan 2 currencies bevat, alles scheiden met een ',' alleen de laatste met 'and'
    let last = displayCurrencies.pop()
    return displayCurrencies.join(', ') + " and " + last
}

// Functie om alle 'languages' uit het object te halen
function getLanguages(languages) {

    // Loop door de languages en zet deze in een variabele
    let displayLanguages = languages.map(a => a.name)

    // Controleren of deze 1 language bevat, zoja: return
    if (displayLanguages.length === 1) {
        return displayLanguages[0]
    }

    // Controleren of deze 2 languages bevat, zoja: return
    if (displayLanguages.length === 2) {
        return displayLanguages[0] + " and " + displayLanguages[1]
    }

    // Indien deze meer dan 2 languages bevat, alles scheiden met een ',' alleen de laatste met 'and'
    let last = displayLanguages.pop()
    return displayLanguages.join(', ') + " and " + last
}

// Functie voor het maken van de tekst voor een land
function createText(data) {

    // Functies van currencies en languages oproepen en opslaan in een variabele
    const currencies = getCurrencies(data.currencies)
    const languages = getLanguages(data.languages)

    // Return alle opgevraagde informatie in een zin en return deze
    return `${data.name} is situated in ${data.subregion}. It has a population of ${data.population} people.
        The capital is ${data.capital} and you can pay with ${currencies}'s.
        They speak ${languages}.`
}

// ---------------------------------------------------------

window.onload = function () {


    // Luister naar click-events op de button
    document.getElementById('search').addEventListener('click', async event => {

        // Zorg dat de console.log niet telkens refresht na een click
        event.preventDefault()

        // Relevante elementen
        const errorField = document.getElementById('error')
        const resultBox = document.getElementById('result')

        // Input data
        console.log('Search was clicked')
        const {value: query} = document.getElementById('query')
        console.log('Search query: ', query)


        // GET data van de API
        try {

            // Hide elements van oude query
            resultBox.classList.add('hide')
            errorField.classList.add('hide')

            // Zet loading status en GET API data
            event.target.value = 'Loading...'
            const data = await getDataOfCountry(query)

            // Show de country data
            resultBox.classList.remove('hide')
            document.getElementById('flag').src = data.flag
            document.getElementById('header').innerHTML = data.name
            document.getElementById('text').innerHTML = createText(data)

        } catch (e) {

            // Show error in interface
            errorField.classList.remove('hide')
            errorField.innerHTML = `Error: ${e}`

        } finally {

            // Rest search button value
            event.target.value = 'search'

        }

    })

}


