const express = require('express');
const request = require('request');
let fs = require('fs');

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
        
        //res.contentType('application/octet-stream'); //Content type for binary data.
        
        //This way is so express can't add a charset to the headers.
        //When it comes from google it has no charset so I thought that might have been the issue but that didn't fix it.
        //From google the content-type is 'image/jpeg'
        res.writeHeader(200, {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'image/jpeg'
        });
        res.write(body);
        res.end();//*/
        
        //res.contentType('image/jpeg');
        //res.send(body);
    });/*.pipe(fs.createWriteStream("img.jpeg"));
    
    res.header('Access-Control-Allow-Origin', '*');
    res.sendFile('img.jpeg', {root: __dirname});*/
    //I thought maybe I could just send the file after it is saved but it doesn't work, 
    //there is a CORS issue for some reason on the client.
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`listening on ${PORT}`));