const API_URL = `https://restcountries.eu/rest/v2`

let countryName = ''

async function getDataOfCountry(countryName = '') {

    try {

        // Call the api to get the data
        const api_call = `${API_URL}/name/${countryName}`
        console.log('Calling ', api_call)
        const result = await axios(api_call)
        console.log('Response: ', result)

        // Destructure the data so we can use it
        const {data, status} = result

        // Check if everything went ok
        if (status !== 200) throw `Status was ${status}, reason: ${data}`

        return data[0]

    } catch (e) {
        console.error('API ERROR: ', e)
        throw `The getDataOfCountry function broke with: ${e}`
    }

}

// ---------------------------------------------------------

function getCurrencies(currencies) {

    let displayCurrencies = currencies.map(a => a.name)

    if (displayCurrencies.length === 1) {
        return displayCurrencies[0]
    }

    if (displayCurrencies.length === 2) {
        return displayCurrencies[0] + " and " + displayCurrencies[1]
    }

    let last = displayCurrencies.pop()
    return displayCurrencies.join(', ') + " and " + last
}

function getLanguages(languages) {

    let displayLanguages = languages.map(a => a.name)

    if (displayLanguages.length === 1) {
        return displayLanguages[0]
    }

    if (displayLanguages.length === 2) {
        return displayLanguages[0] + " and " + displayLanguages[1]
    }

    let last = displayLanguages.pop()
    return displayLanguages.join(', ') + " and " + last
}

function createText(data) {

    const currencies = getCurrencies(data.currencies)
    const languages = getLanguages(data.languages)

    return `${data.name} is situated in ${data.subregion}. It has a population of ${data.population} people.
        The capital is ${data.capital} and you can pay with ${currencies}'s.
        They speak ${languages}.`
}

// ---------------------------------------------------------

window.onload = function () {


    // Listen to click events on the submit button
    document.getElementById('search').addEventListener('click', async event => {

        event.preventDefault()

        // Relevant elements
        const errorField = document.getElementById('error')
        const resultBox = document.getElementById('result')

        // Input data
        console.log('Search was clicked')
        const {value: query} = document.getElementById('query')
        console.log('Search query: ', query)


        // Get the data from de API
        try {

            // Hide elements of old query
            resultBox.classList.add('hide')
            errorField.classList.add('hide')

            // Set loading status and get API data
            event.target.value = 'Loading...'
            const data = await getDataOfCountry(query)

            // Show de country data
            resultBox.classList.remove('hide')
            document.getElementById('flag').src = data.flag
            document.getElementById('header').innerHTML = data.name
            document.getElementById('text').innerHTML = createText(data)
            // document.getElementById('currencies').innerHTML = getCurrencies(data.currencies)
            // document.getElementById('languages').innerHTML = getLanguages(data.languages)

        } catch (e) {

            // Show error in interface
            errorField.classList.remove('hide')
            errorField.innerHTML = `Error: ${e}`

        } finally {

            // Rest search button value
            event.target.value = 'search'

        }

    })

    // Listen also to 'enter' as a click event
    if (event.keyCode === 13) {
        document.getElementById("search").click();
    }

}


