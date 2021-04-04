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
        await client.query(query);
        // need to release connection otherwise hang when out of connections from pool.
        client.release();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(latestRate));
        
    } catch (err) {
        console.error(err);
        res.status(401).send(JSON.stringify({"message":"failed to get latest rate."}));
    }  
});


// POST query db to get btc-usd rate at certain time of day (assume today).
router.post('/querytoday', async (req, res) => {
    try {
        
        const today_date = moment().format("YYYY-MM-DD");
        // no need timezone value as database handles it.
        var timestamp_query_str = moment(today_date + ' ' + req.body.time_of_day).format().replace(/T/, ' ');
        var timestamp_query = timestamp_query_str.substr(0, timestamp_query_str.length - 6);

        const query = `SELECT * FROM ${db_table_name} 
        WHERE lastcalled = '${timestamp_query}';`;

        const client = await dbpool.connect();
        const valueResult = await client.query(query);
        client.release();

        // if no result returned
        res.setHeader('Content-Type', 'application/json');
        if (valueResult.rows[0] == undefined) {

            const prev_time_query = `SELECT * FROM ${db_table_name} 
            WHERE lastcalled <= '${timestamp_query}' ORDER BY lastcalled
            DESC LIMIT 1;`;

            const next_time_query = `SELECT * FROM ${db_table_name} 
            WHERE lastcalled >= '${timestamp_query}';`;

            const client = await dbpool.connect();
            const prev_valueResult = await client.query(prev_time_query);
            const next_valueResult = await client.query(next_time_query);
            client.release();
      
            var prev_timestamp_in_miliseconds = convert_to_miliseconds(prev_valueResult.rows[0].lastcalled);
            var next_timestamp_in_miliseconds = convert_to_miliseconds(next_valueResult.rows[0].lastcalled);
            var searched_timestamp_in_miliseconds = convert_to_miliseconds(timestamp_query);

            // get nearest time difference between the prev and next timestamps
            var prev_timestamp_difference = Math.abs(
                prev_timestamp_in_miliseconds - searched_timestamp_in_miliseconds
            );
            var next_timestamp_difference = Math.abs(
                next_timestamp_in_miliseconds - searched_timestamp_in_miliseconds
            );   

            // return the result with the smaller difference
            if (prev_timestamp_difference < next_timestamp_difference) {
                res.status(200).send(
                    JSON.stringify(
                        convert_to_localized_timezone(prev_valueResult.rows[0])
                ));
            } else {
                res.status(200).send(
                    JSON.stringify(
                        convert_to_localized_timezone(next_valueResult.rows[0])
                ));
            }

        } else {
            res.status(200).send(JSON.stringify(valueResult.rows[0]));
        }


    } catch (err) {
        console.error(err);
        res.status(401).send(JSON.stringify({"message":`${err}`}));
    } 
});

// query btc-usd api every 30 seconds
setInterval(async () => {
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

// calculate timestamp in miliseconds 
function convert_to_miliseconds(timestamp) {

    var milliseconds = moment(timestamp).millisecond();    
    var second_in_milliseconds = moment(timestamp).second() * 1000;
    var minute_in_milliseconds = moment(timestamp).minute() * 60 * 1000;
    var hour_in_milliseconds = moment(timestamp).hour() * 60 * 60 * 1000;

    var time_in_milliseconds = hour_in_milliseconds +
    minute_in_milliseconds + second_in_milliseconds +
    milliseconds;

    return time_in_milliseconds;
}

// return results in localized time zone
function convert_to_localized_timezone(queryResult) {
    var localizedResult = {
        lastcalled: moment.tz(queryResult.lastcalled, time_zone).format().replace(/T/, ' ').replace(/\..+/, ''),
        apiupdatetime: moment.tz(queryResult.apiupdatetime, time_zone).format().replace(/T/, ' ').replace(/\..+/, ''),
        btc: queryResult.btc,
        usd: queryResult.usd
    }

    return localizedResult;
}


module.exports = router;