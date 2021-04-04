'use strict';

const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();

var getrates = require('./getrates');
var cleartable = require('./cleartable');
var showtable = require('./showtable');


const config = require('./config.json');

// Constants
const PORT = dotenv.parsed.BACKEND_PORT_NUMBER ? dotenv.parsed.BACKEND_PORT_NUMBER  : config.backend_port_number; 
const HOST = '0.0.0.0';

// api/v1/
// checking server health
app.get('/api/v1', (req, res) => {
  res.send("server is alive.");
});

// allow json parsing
app.use(express.json());

// get latest btc-usd rates
app.use('/api/v1/rates', getrates);

// clear database table if needed
app.use('/api/v1/cleartable', cleartable);

// show database table if needed
app.use('/api/v1/showtable', showtable);

const server = app.listen(PORT, HOST, () => {   
   console.log("Running on at http://%s:%s", HOST, PORT);
})