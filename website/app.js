// const { default: axios } = require("axios");

/**
 * example:
 * api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     ** Global Variables
     **/
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
    const apiKey = ',us&appid=4a757f3c4ec2d8ed17d63e4f714e75a2&units=metric';

    // Create a new date instance dynamically with JS
    /** Date position changed to be initiated per each click event below,
     * because the page can be loaded from the previous day*/
    // let d = new Date();
    // let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
    // //**OR**//
    // let newDate = d.toDateString();

    /**
     ** END Global Variables 
     **/



    /**
     ** Helper Functions 
     **/
    const isNullOrEmpty = (str) => { return str == null || str == 'undefined' || str.toString().trim() == '' ? true : false; }

    const buildWeatherURL = (zipcode) => { return baseURL + zipcode + apiKey; }

    const formatWeather = (weather) => { // weather object return from the Web API
        return `Temperature: ${(weather.main.temp)}${String.fromCodePoint(8451)}
    (${(weather.main.temp_max)}${String.fromCodePoint(8451)}${String.fromCodePoint(128316)} - ${(weather.main.temp_min)}${String.fromCodePoint(8451)}${String.fromCodePoint(128317)})
    / Humidity: ${weather.main.humidity} 
    / ${weather.weather[0].description}`;
    }

    /**
     ** END Helper Functions 
     **/



    /**
     ** API Calls Functions 
     **/
    const getWeather = async(buildWeatherURL, zipCode = '') => { // Build url with zipCode arg, and get the weather
        return axios.get(buildWeatherURL(zipCode))
            .then(res => {
                if (res.data.cod != 200) { alert(res.data.message); return 0; }
                return formatWeather(res.data);
            }).catch(err => {
                alert('An error occured please try again!');
                console.log('Error Occurred:', err);
                return null;
            });
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
            alert('An error occurred please try again');
            return null;
        }
        /**
         * I have tried axios but I felt it is a bit slower!! Is that right ?!
         * **/
        // return axios.post(url, data)
        //     .then(res => {
        //         console.log(res.data);
        //         return res.data;
        //     }).catch(err => {
        //         alert('An error occured please try again!');
        //         console.log('Error in Saving Data:', err);
        //         return null;
        //     });
    }

    const getData = async url => { // Get Weather data from server projectData
        return axios.get(url).then(res => res.data).catch(err => {
            alert('An error occured please try again');
            console.log('An error occured:', console.error(err));
            return null;
        });
    }

    /**
     ** END API Calls Functions 
     **/



    /**
     ** Application Main functions 
     **/
    const checkWeather = async() => { // Chain call to: GET weather with Zipcode THEN Update interface with result data of the API call
        const zipCode = document.querySelector('#zip').value;
        if (isNullOrEmpty(zipCode)) { alert('Please enter Zip code'); return; }
        getWeather(buildWeatherURL, zipCode)
            .then((weatherDesc) => {
                if (weatherDesc == 0 || isNullOrEmpty(weatherDesc)) { throw new Error('BreakChain: error in loading weather'); }
                return getUserEntriesAndSaveWeather(weatherDesc);
            }).then((res) => {
                if (isNullOrEmpty(res)) throw new Error('BreakChain: data didn\'t posted successfuly.');
                updateUI();
            }).catch(err => {
                console.log(err);
                return;
            });
    }

    const getUserEntriesAndSaveWeather = async weatherDesc => { // Read user input and save data object to server object
        const howItFeels = document.querySelector('#feelings').value;
        // We can make the feeling area mandatory by removing comment from the next line:
        // if (isNullOrEmpty(howItFeels)) { alert('Please enter How Are You Feeling Today.'); return; }
        return await saveData('/postData', { temp: weatherDesc, date: new Date().toDateString(), content: howItFeels });
    }

    const updateUI = async() => { // Get data object from the server and update UI
        const projData = await getData('/getData');
        if (projData == null) { console.log('entered'); return; }
        document.querySelector('#date').textContent = String.fromCodePoint(128197) + projData.date;
        document.querySelector('#temp').textContent = String.fromCodePoint(127777) + projData.temp;
        document.querySelector('#content').textContent = String.fromCodePoint(128153) + projData.content;
    }

    /**
     ** END Application Main functions 
     **/




    /**
     ** Event Listeners 
     **/
    document.querySelector('#generate').addEventListener('click', checkWeather);

    /**
     ** END Event Listeners 
     **/
});