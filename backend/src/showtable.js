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
  port: dbport,
});


dbpool.on('error', (err, client) => {
  console.error('Error:', err);
});


// show paginated version
router.get('/paginated', async (req, res) => {
    try {

        const tableLengthQuery = `SELECT COUNT(lastcalled) FROM ${db_table_name};`;

        const client = await dbpool.connect();
        const tableLength = await client.query(tableLengthQuery);
        client.release();

        var btcUsdExchange = {}; 
        
        var i = 0;
        while (i < tableLength.rows[0].count) {
            
            if (i == 0) {
                var pageArray = [];
                const query = `SELECT * FROM ${db_table_name} 
                ORDER BY lastcalled DESC LIMIT 10;
                `;
                //console.log(query);
                const client = await dbpool.connect();
                const tableResult = await client.query(query);
                client.release();
                //console.log(tableResult.rows);

                for (let row of tableResult.rows) {
                    pageArray.push(convert_to_localized_timezone(row));
                }
                var pageNum = i / 10 + 1;
                btcUsdExchange[`page${pageNum}`] = pageArray;

            } else {
                var pageArray = [];
                const query = `SELECT * FROM ${db_table_name} 
                ORDER BY lastcalled DESC LIMIT 10 OFFSET ${i};
                `;
                //console.log(query);
                const client = await dbpool.connect();
                const tableResult = await client.query(query);
                client.release();
                //console.log(tableResult.rows);

                for (let row of tableResult.rows) {
                    pageArray.push(convert_to_localized_timezone(row));
                }
                var pageNum = i / 10 + 1;
                btcUsdExchange[`page${pageNum}`] = pageArray;
            }
            
            i = i + 10;
            
        }
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(btcUsdExchange));


    } catch (err) {
        console.error(err);
    } 
});

// show whole table - return as array
router.get('/', async (req, res) => {
    try {

        var btcUsdExchangeArray = [];
        const query = `SELECT * FROM ${db_table_name};`;
        const client = await dbpool.connect();
        const tableResult = await client.query(query);
        client.release();

        for (let row of tableResult.rows) {
            btcUsdExchangeArray.push(convert_to_localized_timezone(row));
        }

        res.status(200).send(btcUsdExchangeArray);

    } catch (err) {
        console.error(err);
    } 
});

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