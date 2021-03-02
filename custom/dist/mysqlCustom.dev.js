"use strict";

var mysql = require('mysql');

require('dotenv').config();

var sendSms = require('../custom/nexmo');

var sendToDiscord = require('../custom/discord');

var createConn = function createConn(sql, params, callback) {
  var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });
  con.connect(function (err) {
    if (err) {
      //Sends error forward into apllication
      callback([500, 'SQL connection Error']); //Sends error over SMS to an Admin

      sendSms(process.env.PHONE_NUMBER_ADMIN, 'SQL connection Error. \n More info on Discord channel "cit-api-responses"'); //Sends error over Discord to an Admin

      sendToDiscord('***SQL connection Error:*** ' + err.sqlMessage);
    } else {
      con.query(sql, params, function (err, result) {
        con.end();

        if (err) {
          //Send error forward into apllication
          callback([500, 'SQL query Error']); //Sends error over SMS to an Admin

          sendSms(process.env.PHONE_NUMBER_ADMIN, 'SQL query Error. \n More info on Discord channel "cit-api-responses"'); //Sends error over Discord to an Admin

          sendToDiscord('***SQL query Error:*** ' + err.sqlMessage); //Sends result forward
        } else callback(null, result);
      });
    }
  });
};

module.exports = createConn;