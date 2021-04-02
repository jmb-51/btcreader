'use strict';

const express = require('express');
const app = express()
const config = require('./config.json');

// Constants
const PORT = config.port;
const HOST = config.listening_host;
const BTCUSD_API = config.btc_api;

// api/v1/btcreader
app.get('/', (req, res) => {
  res.send(BTCUSD_API);
});

const server = app.listen(PORT, HOST, () => {   
   console.log("Running on at http://%s:%s", HOST, PORT)
})