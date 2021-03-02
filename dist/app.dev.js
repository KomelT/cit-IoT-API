#!/usr/bin/env node
// Modules imports
"use strict";

var express = require('express');

var app = express();

require('dotenv').config();

var bodyParser = require('body-parser');

var helmet = require('helmet');

var compression = require('compression');

var sendSms = require('./custom/nexmo');

var cors = require('cors'); // Middlewares


app.use(compression());
app.use(helmet());
app.use(bodyParser.json()); // Enable cors

app.use(cors()); // Import routes

var sendData = require('./routes/post/sendData');

var logIn = require('./routes/post/logIn'); //45L1fMG&Ep7P9SR^P1XVymosAqjd7&0y

/*
const bcrypt = require('bcrypt');

bcrypt.hash('matejmozetic', 14, function (err, hash) {
	console.log(hash);
	bcrypt.compare('matejmozetic', hash, function (err, result) {
		console.log(result);
	});
});*/
//throw new Error('listId does not exist');
// Routes


app.use('/sendData', sendData);
app.use('/logIn', logIn); // Unfulfilled request catches here

app.get('*', function (req, res) {
  res.redirect('https://facebook.com');
}); // App listening on port

app.listen(process.env.APP_PORT, function (err) {
  if (err) {
    // If there is error
    console.log('Err');
    sendSms(process.env.PHONE_NUMBER_ADMIN, "Error, API can't start!");
  } else {
    // If there is no error
    console.log('Listening on port ' + process.env.APP_PORT);
    sendSms(process.env.PHONE_NUMBER_ADMIN, 'API started!');
  }
});