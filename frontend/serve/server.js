'use strict';

const dotenv = require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const path = require('path');
const app = express();

const PORT = dotenv.parsed.FRONTEND_PORT_NUMBER; 
const HOST = '0.0.0.0';

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(PORT, HOST, () => {   
    console.log("Running on at http://%s:%s", HOST, PORT);
 })