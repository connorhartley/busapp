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

    if (data instanceof {}) {
      this.data = data;
    } else {
      throw new Error("Invalid data type was recieved.");
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getColour() {
    return this.data.colors[id];
  }

  getStops() {
    return this.data.stops[id];
  }

  getMondayToFriday() {
    return this.data.timesMonFri[id];
  }

  getFinalFriday() {
    return this.data.timesMonFri[id].concat(this.data.timesFri[id]);
  }

  getSaturday() {
    return this.data.timesSat[id];
  }

  getSunday() {
    return this.data.timesSun[id];
  }
}

// MODULE EXPORT

var table = {}

(function() {
  for (var i = 0; i < data.buses.length; i++) {
    table[data.buses[i].id] = new Bus(data.buses[id].id, data.buses[id].name);
  }
})

module.exports = table;
