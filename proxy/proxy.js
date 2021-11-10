const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/list/:url', (req, res) => {
    console.log("req", req.params.url);
    
    request({
        url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + req.params.url 
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log(error);
            return res.status(500).json({ type: 'error', message: error.message });
        }

        res.json(JSON.parse(body));
    });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));