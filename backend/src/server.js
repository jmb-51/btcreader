'use strict';

const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();

var getrates = require('./getrates');
var cleartable = require('./cleartable');


const config = require('./config.json');

// Constants
const PORT = dotenv.parsed.PORT_NUMBER ? dotenv.parsed.PORT_NUMBER  : config.port; 
const HOST = '0.0.0.0';

// api/v1/
// checking server health
app.get('/api/v1', (req, res) => {
  res.send("server is alive.");
});

// get latest btc-usd rates
app.use('/api/v1/rates', getrates);

// clear database if needed
app.use('/api/v1/cleartable', cleartable);

const server = app.listen(PORT, HOST, () => {   
   console.log("Running on at http://%s:%s", HOST, PORT);
})