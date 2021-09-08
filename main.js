const API_URL = `https://restcountries.eu/rest/v2`

let query = ''

async function fetchData(countryName = '') {

    try {

        // Call the api to get the data
        const api_call = `${API_URL}/name/${countryName}`
        console.log('Calling ', api_call)
        const result = await axios(api_call)
        console.log('Response: ', result)

        // Destructure the data so we can use it
        const {status, data} = result

        // Check if everything went ok
        if (status !== 200) throw `Status was ${status}, expected "ok"`


        const flag = data[0].flag
        const country = data.name
        const subregion = data.subregion
        const population = data.population
        const capital = data.capital
        const currencies = getCurrencies(data[0])
        const languages = getLanguages(data[0])

        return country

    } catch (e) {
        console.error('API ERROR: ', e)
        throw `The getDataOfCountry function broke with: ${e.message || e}`
    }

}



// ---------------------------------------------------------


function getCurrencies(data) {
    let valuta = []

    const currencies = data.currencies

    for (let i = 0; i < currencies.length; i++) {
        valuta.push(currencies[i].name)
    }

    if (currencies.length === 1) {
        return valuta[0]
    }

    // Build string with 2 parts named: 'first' and 'second'
    if (currencies.length >= 2) {
        let first = []
        const last = [`${valuta[0]} and ${valuta[1]}`]

        for (let i = 2; i < currencies.length; i++) {
            first.push(currencies[i] + ', ')
        }

        return first + last
    }
}

function getLanguages(data) {

    let languages = []

    const language = data.languages

    for (let i = 0; i < language.length; i++) {
        languages.push(language[i].name)
    }

    if (language.length === 1) {
        return `They speak ${languages[0]}`
    }

    if (language.length >= 2) {

        // Build string with 2 parts named: 'first' and 'second'
        let first = []
        const last = [`${languages[0]} and ${languages[1]}.`]

        for (let i = 2; i < languages.length; i++) {
            first.push(languages[i] + ', ')
        }

        return first + last
    }
}


// [IMAGE: flag]
// [country-name]
//     [country-naam] is situated in [subarea-name]. It has a population of [amount] people.
//     The capital is [city] and you can pay with [currency]'s
// They speak [language], [language] and [language]
//



// ---------------------------------------------------------

window.onload = function () {

    countryName = event.target.value

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
            const country = await fetchData(query)

            // Show de country data
            resultBox.classList.remove('hide')
            document.getElementById('result_information').innerHTML = country
            // document.getElementById('result_information').innerHTML = country
            // document.getElementById('result_information').innerHTML = subregion
            // document.getElementById('result_information').innerHTML = population
            // document.getElementById('result_information').innerHTML = capital
            // document.getElementById('result_information').innerHTML = currencies
            // document.getElementById('result_information').innerHTML = languages
            document.getElementById('result_country').innerHTML = `Information in ${country}: `

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
// ---------------------------------------------------------


