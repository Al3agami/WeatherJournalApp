// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
//bodyParser.urlencoded is Deprecated.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Add Axios to work in fetching API data in node.js
const axios = require('axios');

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 4000;
const server = app.listen(port, () => console.log(`localhost started on port: ${port}`));


app.post('/postData', (req, res) => {
    projectData = req.body;
    console.log(projectData);
    res.send(JSON.stringify(projectData));
});

app.get('/getData', (req, res) => {
    res.send(JSON.stringify(projectData));
});