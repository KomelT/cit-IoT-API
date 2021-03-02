"use strict";

var bcrypt = require('bcrypt');

var createConn = require('./mysqlCustom');

var timeStamp = require('../custom/timeStamp');

var apiAuth = function apiAuth(api_name, api_passwd, callback) {
  // SQL query
  var sql = 'SELECT refuse, apiPasswd  FROM apiAuth WHERE apiName=?';
  var params = [api_name];
  createConn(sql, params, function (err, result) {
    if (err) callback(err[0], err[1]);else {
      var apiPasswd = 0;
      var refuse = 2; // Parse data from result

      try {
        apiPasswd = result[0].apiPasswd;
        refuse = result[0].refuse;
      } catch (e) {
        apiPasswd = 0;
        refuse = 2;
      }

      console.log(timeStamp());

      if (refuse == 0 && apiPasswd != 0) {
        bcrypt.compare(api_passwd, apiPasswd, function (err, auth) {
          console.log(timeStamp());
          if (err) callback([500, 'Internal hashing Error']);else {
            if (auth) callback(undefined);else callback([403, 'Forbiden AP auth Error']);
          }
        });
      } else if (refuse == 1) callback([403, 'Forbiden API auth Error']);else if (apiPasswd == 0) callback([403, 'Forbiden API auth Error']);else callback([500, 'Internal Error']);
    }
  });
};

module.exports = apiAuth;