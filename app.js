#!/usr/bin/env node

// Modules imports
const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
var helmet = require('helmet');
var compression = require('compression');
const sendSms = require('./custom/nexmo');
var cors = require('cors');
const fetch = require("node-fetch");


// Middlewares
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());

// Enable cors
app.use(cors());

// Import routes
const sendData = require('./routes/post/sendData');
const logIn = require('./routes/post/logIn');
const mainContent = require("./routes/post/mainContent");

//45L1fMG&Ep7P9SR^P1XVymosAqjd7&0y
/*
const bcrypt = require('bcrypt');

bcrypt.hash('2gh7H6SI$Bz8Es$M2no@mv0G0#V8fN*H', 14, function (err, hash) {
	console.log(hash);
	bcrypt.compare('2gh7H6SI$Bz8Es$M2no@mv0G0#V8fN*H', hash, function (err, result) {
		console.log(result);
	});
});
*/
//throw new Error('listId does not exist');
// Routes
app.use('/sendData', sendData);
app.use('/logIn', logIn);
app.use('/mainContent', mainContent);

app.post("/holiday", (req, res) => {
	fetch('https://api.dmz6.net/datum/info/' + req.body.date)
		.then(res => res.text())
		.then(text => res.send(text))
})

// Unfulfilled request catches here
app.get('*', (req, res) => {
	res.redirect('https://facebook.com');
});

// App listening on port
app.listen(process.env.APP_PORT, (err) => {
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
