const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

const express = require('express');
const app = express();
const port = 6000;

const fetch = require('node-fetch');

const NodeCache = require('node-cache');
const cache = new NodeCache();

async function getGeo(point: string): Promise<Object> {
    let output = cache.get(point);
    if(output === undefined) {
        console.log(`Point ${point} not found in cache, querying from ongeo.`)
        output = await fetch(`https://address.reverse.geocoding.api.ongeo.pl/1.0/search?api_key=${config.apiKey}&point=${point}&additionalData=address`)
            .then(response => response.json())
            .then(response => {
                cache.set(point, response);
                return response;
            })
            .catch(error => {
                console.error(error);
                return undefined;
            })
    }
    return output;
}

app.get('/api/search', async (req, res) => {
    let point = req.query.point as string;
    console.log(`Requested point ${point}`);
    if(point!==undefined) {
        let geo = await getGeo(point);
        if(geo === undefined) res.sendStatus(404);
        else res.json(geo);
    }
    else res.sendStatus(404);
});

let server = app.listen(port, ()=>{console.log(`czyfryzjerzyotwarci cache listening on ${port}`)});
