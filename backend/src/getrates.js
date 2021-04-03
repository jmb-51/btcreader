const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const moment = require('moment-timezone');


// env variables
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const config = require('./config.json');
const btcusd_api = dotenv.parsed.BTCUSD_API ? dotenv.parsed.BTCUSD_API  : config.btcusd_api; 
const dbuser = dotenv.parsed.DB_USER ? dotenv.parsed.DB_USER  : config.db_user; 
const database = dotenv.parsed.DB_DATABASE ? dotenv.parsed.DB_DATABASE  : config.db_database; 
const dbport = dotenv.parsed.DB_PORT_NUMBER ? dotenv.parsed.DB_PORT_NUMBER  : config.db_port_number; 
const db_table_name = dotenv.parsed.DB_TABLENAME ? dotenv.parsed.DB_TABLENAME  : config.db_table_name; 
const time_zone = dotenv.parsed.TIMEZONE ? dotenv.parsed.TIMEZONE  : config.time_zone; 

// database connection pool
const dbpool = new Pool({
    user: dbuser,
    host: "btcreader-postgres",
    database: database,
    password: process.env._DB_PASSWORD,
    port: dbport
});


dbpool.on('error', (err, client) => {
    console.error('Error:', err);
});


// get latest rate - but not automated
router.get('/latest', async (req, res) => {
    try {
        const apiResult =  await axios.get(btcusd_api);
  
        var latestRate = {
            lastCalled: moment.tz(time_zone).format().replace(/T/, ' ').replace(/\..+/, ''),
            apiUpdateTime: moment.tz(apiResult.data.time.updatedISO, time_zone).format(),
            btc: 1,
            usd: apiResult.data.bpi.USD.rate_float
        };

 
        // add latest result to table
        const query = `
        INSERT INTO ${db_table_name} (LASTCALLED, APIUPDATETIME, BTC, USD)
        VALUES ('${latestRate.lastCalled}', '${latestRate.apiUpdateTime}', ${latestRate.btc}, ${latestRate.usd})
        `;
        const client = await dbpool.connect();
        const tableResult = await client.query(query);
        // need to release connection otherwise hang when out of connections from pool.
        client.release();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(latestRate));
        
    } catch (err) {
        console.error(err);
        res.status(401).send(JSON.stringify({"message":"failed to get latest rate."}));
    }  
});

//TODO: make post so if postgresql query is not found. 
//POST query db to get at certain time of day.
// router.post('/query', async (req, res) => {

//     try {
//         const query = `SELECT * FROM btcusdexchange`;
//         const client = await dbpool.connect();
//         const tableResult = await client.query(query);
//         var btcUsdExchange = []

//         for (let row of tableResult.rows) {
//             console.log(row);
//             btcUsdExchange.push(row);
//         }

//         //res.setHeader('Content-Type', 'application/json');
//         //res.status(200).send(JSON.stringify(latestBtcUsdPrice));
//         res.status(200).send(btcUsdExchange)

//     } catch (err) {
//         console.error(err);
//     } 
// });

// query btc-usd api every 30 seconds
const getLatestPriceLoop = setInterval(async () => {
    try {
        const apiResult = await axios.get(btcusd_api);

        var latestRate = {
            lastCalled: moment.tz(time_zone).format().replace(/T/, ' ').replace(/\..+/, ''),
            apiUpdateTime: moment.tz(apiResult.data.time.updatedISO, time_zone).format().replace(/T/, ' ').replace(/\..+/, ''),
            btc: 1,
            usd: apiResult.data.bpi.USD.rate_float
        };
        
        const query = `
            INSERT INTO ${db_table_name} (LASTCALLED, APIUPDATETIME, BTC, USD)
            VALUES ('${latestRate.lastCalled}', '${latestRate.apiUpdateTime}', ${latestRate.btc}, ${latestRate.usd})
            `;
        const client = await dbpool.connect();
        const tableResult = await client.query(query);
        // need to release connection otherwise hang when out of connections from pool.
        client.release();

    } catch (err) {
        console.error(err);
    } 
}, 30000);


module.exports = router;