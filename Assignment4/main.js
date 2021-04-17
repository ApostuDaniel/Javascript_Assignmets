let docList = document.getElementById("countries")
let countriesList = []
const getCountryList = async () =>{
    const unformated = await fetch('https://api.covid19api.com/countries')
    const formated = await unformated.json()
    return formated
}

const htmlCountryList = async () =>{
    countriesList = await getCountryList();
    countriesList.forEach(element => {
        const countryOption = document.createElement("option")
        countryOption.value = element["Country"]
        countryOption.id = element["Slug"]
        docList.appendChild(countryOption)
    });
}

htmlCountryList()

/*
const dataFromXDaysAgo = async (country, days) => {
    const url = `https://api.covid19api.com/total/country/${country}/status/confirmed/date/${daysAgo(days)}T00:00:00Z`
    const unformated = await fetch(url)
    const formated = await unformated.json()
    return formated
}
*/

const getTotalStatsPerCountry = async (country) =>{
    const unformated = await fetch(`https://api.covid19api.com/total/country/${country}`)
    const formated = await unformated.json()
    return formated;
}

const updateTotal = (data) =>{
    document.getElementById("totalConfirmed").innerHTML = `Confirmed: ${data["Confirmed"]}`
    document.getElementById("totalRecovered").innerHTML = `Recovered: ${data["Recovered"]}`
    document.getElementById("totalDeaths").innerHTML = `Deaths: ${data["Deaths"]}`
}

const updateToday = (today, yesterday) =>{
    document.getElementById("todayConfirmed").innerHTML = `Confirmed: ${today["Confirmed"] - yesterday["Confirmed"] }`
    document.getElementById("todayRecovered").innerHTML = `Recovered: ${today["Recovered"] - yesterday["Recovered"]}`
    document.getElementById("todayDeaths").innerHTML = `Deaths: ${today["Deaths"] - yesterday["Deaths"]}`
    document.getElementById("activeCases").innerHTML = `Active: ${today["Active"]}`
}


const showStatistics = async (country) =>{
    let countryData = await getTotalStatsPerCountry(country)
    console.log(countryData[countryData.length - 1], countryData[countryData.length - 2])
    
    updateTotal(countryData[countryData.length - 1])
    updateToday(countryData[countryData.length - 1], countryData[countryData.length - 2] )
}


const buttonEvent = async () =>{
    const country = document.getElementById("input").value
    let found = false
    for(let i = 0; i < countriesList.length; ++i ){
        if(country === countriesList[i]["Country"] || country === countriesList[i]["Slug"]){
            found = true;
            await showStatistics(countriesList[i]["Slug"])
            break;
        }
    }
    if (found == false) alert("Invalid input")
}


const getCurrentCountry = async () => {
    const ufdata = await fetch('http://ip-api.com/json')
    const fdata = await ufdata.json()
    return fdata["country"]
}


const daysAgo = (howMany) => {
    let d = new Date();
    function z(n){return (n<10?'0':'') + n}
    return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' + z(d.getDate()-1 - howMany)       
  }
