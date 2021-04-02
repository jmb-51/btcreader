const axios = require('axios');
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const btcusd_api = dotenv.parsed.BTCUSD_API ? dotenv.parsed.BTCUSD_API  : config.btcusd_api; 


// get latest rate - but not automated
router.get('/latest', async (req, res) => {
    try {
        const apiResult =  await axios.get(btcusd_api);
        
        var latestBtcUsdPrice = {
            apiUpdateTime: apiResult.data.time.updatedISO,
            btc: 1,
            usd: apiResult.data.bpi.USD.rate_float
        };

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(latestBtcUsdPrice));
        
    } catch (err) {
        console.error(err);
    }  
});

//TODO: make post so if postgresql query is not found. 
// can consider adding new entry to table.


// query btc-usd api every 30 seconds
const getLatestPriceLoop = setInterval(async () => {
    try {
        const apiResult = await axios.get(btcusd_api);
       
        var btcUsdPrice = {} // empty Object
        var key = new Date().toISOString();
        btcUsdPrice[key] = []; // empty Array, which you can push() values into


        var latestRate = {
            apiUpdateTime: apiResult.data.time.updatedISO,
            btc: 1,
            usd: apiResult.data.bpi.USD.rate_float
        };

        btcUsdPrice[key].push(latestRate);
        console.log(JSON.stringify(btcUsdPrice));

    } catch (err) {
        console.error(err);
    }
}, 30000);


module.exports = router;