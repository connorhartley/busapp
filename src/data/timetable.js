/*************************************************************
 * Timetable Script - The script that contains timetable.
 *************************************************************/

var timetable2017 = require('./2017-timetable');

function timetable () {
  return [
    y2017: timetable2017
  ];
}

// MODULE EXPORTS

module.exports = timetable;
