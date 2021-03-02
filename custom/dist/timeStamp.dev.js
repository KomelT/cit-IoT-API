"use strict";

var timeStamp = function timeStamp() {
  var year = new Date().getFullYear() + '.';
  var month = new Date().getMonth() + '.';
  var day = new Date().getDay() + ' ';
  var hour = new Date().getHours() + ':';
  var minute = new Date().getMinutes() + ':';
  var second = new Date().getSeconds() + '.';
  var milisec = new Date().getMilliseconds();
  return year + month + day + hour + minute + second + milisec;
};

module.exports = timeStamp;