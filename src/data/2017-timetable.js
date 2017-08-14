var _ = require('lodash')

var dataTimes = require('./2017/bus-stops-and-times')
var dataCoordinates = require('./2017/bus-coordinates')

var data = _.assign(dataTimes, dataCoordinates)

// BUS CLASS

// I have to use classes because my teacher said so ._.

class Bus {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.data = data;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCoordinates() {
    return this.data.stopCoordinates[this.id];
  }

  getPaths() {
    return this.data.shapeCoordinates[this.id];
  }

  getColour() {
    return this.data.colors[this.id];
  }

  getStops() {
    return this.data.stops[this.id];
  }

  getMondayToFriday() {
    return this.data.timesMonFri[this.id];
  }

  getFinalFriday() {
    return this.data.timesMonFri[this.id].push(this.data.timesFri[this.id]);
  }

  getSaturday() {
    return this.data.timesSat[this.id];
  }

  getSunday() {
    return this.data.timesSun[this.id];
  }
}

// MODULE EXPORT

var table = {};

(function() {
  for (var i = 0; i < data.buses.length; i++) {
    table[data.buses[i].id] = new Bus(data.buses[i].id, data.buses[i].name);
  }
})();

module.exports = table;
