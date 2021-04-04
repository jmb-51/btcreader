const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// env variables
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const config = require('./config.json');
const dbuser = dotenv.parsed.DB_USER ? dotenv.parsed.DB_USER  : config.db_user; 
const database = dotenv.parsed.DB_DATABASE ? dotenv.parsed.DB_DATABASE  : config.db_database; 
const dbport = dotenv.parsed.DB_PORT_NUMBER ? dotenv.parsed.DB_PORT_NUMBER  : config.db_port_number; 
const db_table_name = dotenv.parsed.DB_TABLENAME ? dotenv.parsed.DB_TABLENAME  : config.db_table_name; 

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


// clear table - maybe change to post
router.post('/', async (req, res) => {
  try {

    if (req.body.operation == 'cleartable') {
      const query = `DELETE FROM ${db_table_name}`;
      const client = await dbpool.connect();
      await client.query(query);
      client.release();

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({"message":`table ${db_table_name} cleared`}));

    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(401).send(JSON.stringify({"message":`Incorrect operation. table ${db_table_name} not cleared`}));
    }

  } catch (err) {
      console.error(err);
  } 

});

module.exports = router;