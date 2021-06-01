// Start Global Variables

// HTML Elements
const generate = document.getElementById('generate');
const weather = document.querySelector('.weather');
const weatherWrapper = document.querySelector('.wrapper');
const zipInput = document.getElementById('zip');
const feelInput = document.getElementById('feel');
const inputErrors = document.querySelector('.entry__errors');
const header = document.querySelector('.app__header');
const uiDate = document.getElementById('date');
const city = document.getElementById('city');
const country = document.getElementById('country');
const state = document.getElementById('state');
const icon = document.getElementById('icon');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const wind = document.getElementById('wind');
const content = document.getElementById('content');
let isLoading = true;
let errors = [];

// Personal API Key for OpenWeatherMap API
const baseAPI = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=53c951eb657ffba0a5d9e60f81499e31';
const apiUnit = '&units=metric';

// End Global Variables

// Get the Date 
const d  = new Date();
const date = (d.getMonth() + 1) +'/'+ d.getDate() +'/'+ d.getFullYear();

// Start Helper Function

const toggleWeatherBlock = _ => {
    let weatherWrapperHeight = weatherWrapper.getBoundingClientRect().height;
    if(isLoading){
        // when the page is fetching data from the server the block will collapse
        weather.style.height = 0;
    }else {
        // when the page fetched the data from the server the block will slide down displaying the info
        weather.style.height = weatherWrapperHeight + 'px'
    }
} 

const clearInputs = _ => {
    zipInput.value = '';
    feelInput.value = '';
}

const loadingImg = _ => {
    if(isLoading){
        // when the page start fetching the data from the server the the loading image will show up
        generate.innerHTML = '<img src="img/loading.svg" alt="loading">'
    }else {
        // when the page got the data from the server the loading image will disappeared 
        // and replaced with word ( Generate ).
        generate.innerHTML = 'Generate';
    }
}

const changeHeaderColor = _ => {
    if(isLoading){
        header.style.color = '#071f38'
    }else{
        header.style.color = '#dadada'
    }
}

const actionsOnLoading = _ => {
    toggleWeatherBlock();
    loadingImg();
    changeHeaderColor();
}

const inputVerification = (error = '') => {
    // Empty the Array that hold errors
     errors = [];
    //  Push the outside error
     error.length > 0 ? errors.push(error) : errors = [];
    // change the element's opacity from zero to 1
    inputErrors.style.opacity = 1;

    // remove the previous errors from the elements
    inputErrors.innerHTML = '';

    // if any of the inputs is empty push error text to the array
    if(zipInput.value === ""){
        errors.push('Please Write Your Zip Code');
    }
    if(feelInput.value === ""){
        errors.push('Please, Tell Us What You Feel Today')
    }

    // if there're no errors return true
    if(errors.length === 0) return true;

    // if there're errors 
    if(errors.length > 0){
        // display them 
        for(error of errors){
            const list = document.createElement('li');
            list.innerHTML = error;
            inputErrors.appendChild(list)
        }
        // and will disappear after 3 seconds
        setTimeout( _ => {
            inputErrors.style.opacity = 0;
        },3000)
        // return false 
        return false;
    }
}

const getData = async (url = '') => {
    const response = await fetch(url);
    if(response.ok){
        try {
            const data = await response.json();
            return data
        }catch(error){
            console.error('ERROR', error)
        }
    }else{
        return {};
    }
}

const postData = async (url = '', data = {}) => {
    const post = await fetch(url, {
        method:'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })

    try {
        const data = await post.json();
        return data
    }catch(error){
        console.error('ERROR',error)
    }
}

const updateUI = data => {
    uiDate.innerHTML = data.date;
    city.innerHTML = data.city + ',';
    country.innerHTML = data.country;
    state.innerHTML = data.state;
    icon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    temp.innerHTML = data.temp;
    humidity.innerHTML = data.humidity + '%';
    pressure.innerHTML = data.pressure + ' hPa';
    wind.innerHTML = data.wind + ' m/s';
    content.innerHTML = data.feeling;
}

const mainActions = _ => {
    // Create the target API URL
    const apiURL = baseAPI + zipInput.value + apiUnit + apiKey;
    // Use URL to get fetch data from API server
    getData(apiURL).then(data => {
        // check if data object is empty or not
        if(Object.keys(data).length > 0) {
            // Post the fetched data to the server
            postData('/',[data, feelInput.value, date]);
            // Get the Required data from the server
            getData('/all').then(data => {
                // Update the UI with the fetched data from server
                updateUI(data)
                // hide the loading image and slide down the weather block
                isLoading = false;
                actionsOnLoading()
                // Clear all the inputs
                clearInputs();
            })
        }else {
            let error = `Zip Code isn't Correct, Please Enter a Correct One`;
            inputVerification(error)
            isLoading = false;
            loadingImg();
        }
    })
}

// End Helper Functions

// Start Main Function
window.addEventListener('DOMContentLoaded', _ => {
    // Event listener to add function to existing HTML DOM element
    generate.addEventListener('click', e => {
        /* Functions called by event listener */
        // Prevent The submit button from its default action
        e.preventDefault();
        // Make sure all input fields aren't empty
        if(inputVerification()){
            // display loading gif when during fetching data from server
            // and hide weather block during fetching data from server
            isLoading = true;
            actionsOnLoading()
            // fetch data from remote API server,post to the server and update UI
            mainActions(); 
        }    
    })
})

// End Main Function




