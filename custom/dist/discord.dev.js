"use strict";

var fetch = require('node-fetch');

var timeStamp = require('../custom/timeStamp');

var sendToDiscord = function sendToDiscord(text) {
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: '***' + timeStamp() + '***' + ' \n  ------------------- \n' + text + ' \n  ------------------- '
    })
  };
  fetch('https://discordapp.com/api/webhooks/771291524654825512/kEQ0btriU2ljzPx-1zmv5wFvcasekM0Z049pHbmc4C2LeYa92vl_26ddTdSgF3yEqNqK', requestOptions);
};

module.exports = sendToDiscord;