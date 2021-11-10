const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/list/:url', (req, res) => {
    console.log("list req", req.params.url);
    
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

app.get('/pics/:url', (req, res) => {
    console.log("pics req", req.params.url);
    
    request({
        url: "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + req.params.url 
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log(error);
            return res.status(500).json({ type: 'error', message: error.message });
        }
        
        //res.contentType('application/octet-stream');
        
        res.writeHeader(200, {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'image/jpeg'
        });
        res.write(body);
        res.end();//*/
        //res.contentType('image/jpeg');
        //res.send(body);
    });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));