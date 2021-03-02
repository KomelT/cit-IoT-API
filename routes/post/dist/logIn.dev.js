"use strict";

var express = require('express');

var router = express.Router();

var apiAuth = require('../../custom/apiAuth');

var createConn = require('../../custom/mysqlCustom');

var bcrypt = require('bcrypt');

var crypto = require('crypto');

router.post('/', function (req, res) {
  console.log(req.statusCode); //Extract data

  var api_name = req.body.api_name;
  var api_passwd = req.body.api_passwd;
  var email = req.body.email;
  var password = req.body.password; //Is enough data provided?

  if (api_name == undefined) {
    res.status(400).json({
      code: 400,
      message: 'Missing API name'
    });
  } else if (api_passwd == undefined) {
    res.status(400).json({
      code: 400,
      message: 'Missing API passwd'
    });
  } else if (email == undefined) {
    res.status(400).json({
      code: 400,
      message: "Missing user's email"
    });
  } else if (password == undefined) {
    res.status(400).json({
      code: 400,
      message: "Missing user's password"
    });
  } else {
    apiAuth(api_name, api_passwd, function (err) {
      if (err) res.status(err[0]).json({
        code: err[0],
        message: err[1]
      });else {
        var sql = 'SELECT idUser, password FROM user WHERE email=?';
        var params = [email];
        createConn(sql, params, function (err, result) {
          if (err) res.status(err[0]).json({
            code: err[0],
            message: err[1]
          });else {
            if (result.length == 0) res.status(401).json({
              code: 401,
              message: 'Email in geslo, nista pravilna!'
            });else {
              var hash = result[0].password;
              var id = result[0].idUser;
              console.log(hash);
              console.log(password[0]);
              bcrypt.compare(password[0], hash, function (err, auth) {
                if (err) {
                  res.status(500).json({
                    code: 500,
                    message: 'Internal hashing Error'
                  });
                } else {
                  if (!auth) res.status(401).json({
                    code: 401,
                    message: 'Email in geslo, nista pravilna!'
                  });else {
                    var token_id = crypto.randomBytes(64).toString('hex');
                    sql = 'INSERT INTO session(idSession, time, idUser) VALUES(?, now(),? )';
                    params = [token_id, id];
                    createConn(sql, params, function (err, result) {
                      if (err) res.status(err[0]).json({
                        code: err[0],
                        message: err[1]
                      });else {
                        res.status(200).json({
                          code: 200,
                          message: 'Email in geslo sta pravilna!',
                          token_id: token_id
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }
});
router.post('/validate', function (req, res) {
  //Extract data
  var api_name = req.body.api_name;
  var api_passwd = req.body.api_passwd;
  var token_id = req.body.token_id; //Is enough data provided?

  if (api_name == undefined) {
    res.status(400).json({
      code: 400,
      message: 'Missing API name'
    });
  } else if (api_passwd == undefined) {
    res.status(400).json({
      code: 400,
      message: 'Missing API passwd'
    });
  } else if (token_id == undefined) {
    res.status(400).json({
      code: 400,
      message: 'Missing token'
    });
  } else {
    //Authenticate incoming request
    apiAuth(api_name, api_passwd, function (err) {
      if (err) res.status(err[0]).json({
        code: err[0],
        message: err[1]
      });else {
        var sql = "SELECT IF((SELECT date_add(time, INTERVAL 1 HOUR) FROM session WHERE idSession=?)>now(), 'true', 'false') AS stayloggedIn";
        var params = [token_id];
        createConn(sql, params, function (err, result) {
          if (err) res.status(err[0]).json({
            code: err[0],
            message: err[1]
          });else {
            if (result.length <= 0) res.status(500).json({
              code: 500,
              message: 'Internal server Error'
            });else {
              var validation = result[0].stayloggedIn;
              if (validation == 'true') res.status(200).json({
                code: 200,
                message: 'Your session is stil valid',
                validation: true
              });else if (validation == 'false') res.status(200).json({
                code: 200,
                message: 'Your session is not valid',
                validation: false
              });else res.status(500).json({
                code: 500,
                message: 'Internal server Error'
              });
            }
          }
        });
      }
    });
  }
});
module.exports = router;