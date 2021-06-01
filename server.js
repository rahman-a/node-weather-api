const express = require('express');
const cors = require('cors');


// Setup empty JS object to act as endpoint for all routes
let projectData = {};


// Start up an instance of app
const app = express();

/* Dependencies */
/* Middleware*/
app.use(express.json())

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Server Callback to debug
const listening = _ => {
    console.log(`running on localhost: ${port}`)
}

// Spin up the server
const port = process.env.PORT || 8000
app.listen(port, listening)

// Callback function to complete GET '/all'
const postData = (req, res) => {
    let data  = req.body;
    projectData = {
        date:data[2],
        city:data[0].name,
        country:data[0].sys.country,
        state:data[0].weather[0].description,
        icon:data[0].weather[0].icon,
        temp:data[0].main.temp,
        humidity:data[0].main.humidity,
        pressure:data[0].main.pressure,
        wind:data[0].wind.speed,
        feeling:data[1]
    }
}

const getData = (req, res) => {
    res.send(projectData);
}
// Initialize all route with a callback function

// Post Route
app.post('/',postData);

// Get Route
app.get('/all', getData)



  