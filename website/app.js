/**
 * example:
 * api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}
 */

/*** Global Variables ***/
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = ',us&appid=4a757f3c4ec2d8ed17d63e4f714e75a2';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

/*** END Global Variables ***/



/*** Helper Functions ***/
const isNullOrEmpty = (str) => { return str == null || str == 'undefined' || str.trim() == '' ? true : false; }

const buildWeatherURL = (zipcode) => { return baseURL + zipcode + apiKey; }

const handleResCode = (resCode) => {
    switch (resCode) {

    }
}

const formatWeather = (weather) => { // weather object return from the Web API
    return `Temperature: ${(weather.main.temp- 273.15).toFixed(2)}${String.fromCodePoint(8451)}
    (${(weather.main.temp_max - 273.15).toFixed(2)}${String.fromCodePoint(8451)}${String.fromCodePoint(128316)} - ${(weather.main.temp_min - 273.15).toFixed(2)}${String.fromCodePoint(8451)}${String.fromCodePoint(128317)})
    / Humidity: ${weather.main.humidity} 
    / ${weather.weather[0].description}`;
}

/*** END Helper Functions ***/



/*** API Calls Functions ***/
const getWeather = async(buildWeatherURL, zipCode = '') => { // Build url with zipCode arg, and get the weather
    const url = buildWeatherURL(zipCode);
    const res = await fetch(url);
    try {
        const resData = await res.json();
        if (resData.cod != 200) { handleResCode(resData.cod); return null; }
        console.log(resData);
        return formatWeather(resData);

    } catch (error) {
        console.log('Error Occurred:', error);
        return null;
    }
}


const saveData = async(url = '', data = {}) => { // Save Weather Temp, Date and user feeling of today in projectData object
    const req = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),
    });

    try {
        const projectData = await req.json();
        return projectData;
    } catch (error) {
        console.log('Error in Saving Data', error);
        alert('an error occurred please try again');
        return null;
    }
}

/*** END API Calls Functions ***/



/*** Application Main functions ***/
const checkWeather = async() => { // Chain call to: GET weather with Zipcode THEN Update interface with result data of the API call
    const zipCode = document.querySelector('#zip').value;
    if (isNullOrEmpty(zipCode)) { alert('Incorrect Zip, enter valid Zip'); return; }
    getWeather(buildWeatherURL, zipCode)
        .then(async(data) => {
            if (isNullOrEmpty(data)) { alert('Error in loading zip code data!'); return; }
            getUserEntriesAndSave(data);
        });
}

const getUserEntriesAndSave = async(weatherDesc) => { // Read user input and Update interface with result data of the API call
    const howItFeels = document.querySelector('#feelings').value;

    // We can make the feeling area mandatory by removing comment from the next line:
    // if (isNullOrEmpty(howItFeels)) { alert('Please enter How Are You Feeling Today.'); return; }

    const projData = await saveData('/postData', { temp: weatherDesc, date: newDate, content: howItFeels });
    if (projData == null) { alert('An error occurred during process request, try again later!'); return; }
    updateUI(projData);
}

const updateUI = (projData) => {
    document.querySelector('#date').textContent = String.fromCodePoint(128197) + projData.date;
    document.querySelector('#temp').textContent = String.fromCodePoint(127777) + projData.temp;
    document.querySelector('#content').textContent = String.fromCodePoint(128153) + projData.content;
}

/*** END Application Main functions ***/


/*** Event Listeners ***/
document.querySelector('#generate').addEventListener('click', checkWeather);

/*** END Event Listeners ***/