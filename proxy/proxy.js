const express = require('express');
const request = require('request');
let fs = require('fs');

const app = express();
require('dotenv').config();
const apiKey = "&key=" + process.env.API_KEY;

function getDateTime() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    let time = hours + ':' + minutes + ':' + today.getSeconds() + ' ' + ampm;
    let dateTime = '[' + date + ' ' + time + ']';
    
    return dateTime;
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/list/:url', (req, res) => {
    console.log(getDateTime() + " list req", req.params.url);
    
    request({
        url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + req.params.url + apiKey
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            if (error) {
                console.log(error);
            }
            
            if (error && error.message) {
                return res.status(500).json({ type: 'error', message: error.message });
            } else {
                return res.status(500).json({ type: 'error', message: "An unknown error occured." });
            }
        }

        res.json(JSON.parse(body));
    });
});

app.get('/pics/:url', (req, res) => {
    console.log(getDateTime() + " pics req", req.params.url);
    
    request({
        url: "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + req.params.url + apiKey
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            if (error) {
                console.log(error);
            }
            
            if (error && error.message) {
                return res.status(500).json({ type: 'error', message: error.message });
            } else {
                return res.status(500).json({ type: 'error', message: "An unknown error occured." });
            }
        }
    }).pipe(res);
});

app.get('/directions/:url', (req, res) => {
    console.log(getDateTime() + " directions req", req.params.url);
    
    request({
        url: "https://maps.googleapis.com/maps/api/directions/json?origin=" + req.params.url + apiKey
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            if (error) {
                console.log(error);
            }
            
            if (error && error.message) {
                return res.status(500).json({ type: 'error', message: error.message });
            } else {
                return res.status(500).json({ type: 'error', message: "An unknown error occured." });
            }
        }
        
        res.json(JSON.parse(body));
    });
});

const PORT = process.env.PORT || 25565;
app.listen(PORT, () => console.log(getDateTime() + ` listening on ${PORT}`));