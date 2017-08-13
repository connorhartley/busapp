/*************************************************************
 * Router Script - The script which manages the router.
 *************************************************************/

var VueRouter = require('vue-router');

var fs = require('fs');

// Templates
//
// Templates for specific components with data
// attatched.
//
// @author Connor Hartley
// @version 0.0.1

// Content New Route
var templateContentNewRoute = fs.readFileSync(__dirname + '/templates/content/content-new-route.html', 'utf8');

// Components
//
// Components containing a specific set of data
// and states, each connected to a template.
//
// @author Connor Hartley
// @version 0.0.1

var Plan = {
  template: templateContentNewRoute,
  name: 'new',
  props: [ 'busTimetable' ],
  data() {
    return {
      year: "y2017",
      date: new Date(),
      busRoute: "",
      defaultRoute: "awapuni",
      origin: 0,
      destination: 0,
      time: 0
    }
  },
  created() {
    this.checkData()
  },
  watch: {
    $route: 'checkData'
  },
  methods: {
    checkData() {
      if (!this.$route.params.busRoute) {
        this.busRoute = this.defaultRoute;
        return;
      } else {
        if (!this.$route.params.origin || !this.$route.params.destination
          || !this.$route.params.time) {
            this.$router.replace({name: 'new', params: {
              busRoute: this.$route.params.busRoute,
              time: this.$route.params.time || 0,
              origin: this.$route.params.origin || 0,
              destination: this.$route.params.destination || 0
            }});
          }
      }

      if (this.busRoute != this.$route.params.busRoute) {
        this.$router.replace({name: 'new', params: {
          busRoute: this.$route.params.busRoute,
          time: 0,
          origin: 0,
          destination: 0
        }});

        this.time = 0;
        this.origin = 0;
        this.destination = 0;
      } else {
        this.time = this.$route.params.time;
        this.origin = this.$route.params.origin;
        this.destination = this.$route.params.destination;
      }

      this.busRoute = this.$route.params.busRoute
    },

    // Returns the bus route object by its id.
    getBusById(id) {
      return this.busTimetable[this.year][id];
    },

    getStopsRange(bus) {
      var list = [];

      for (var i = 0; i < bus.getStops().length; i++) {
        if (this.origin != 0 && this.destination != 0) {
          if (i < this.origin) {
            list.push({
              out: true,
              name: bus.getStops()[i]
            })
          } else if (i > this.destination) {
            list.push({
              out: true,
              name: bus.getStops()[i]
            })
          } else {
            list.push({
              out: false,
              name: bus.getStops()[i]
            })
          }
        } else {
          list.push({
            out: false,
            name: bus.getStops()[i]
          })
        }
      }

      return list;
    },

    getTimesById(id) {
      var day = this.date.getDay();
      var hours = this.date.getHours();
      var minutes = this.date.getMinutes();
      var times;
      var list = [];

      switch(day) {
        case 0: {
          times = this.busTimetable[this.year][id].getSunday();
          break;
        }
        case 5: {
          times = this.busTimetable[this.year][id].getFinalFriday();
          break;
        }
        case 6: {
          times = this.busTimetable[this.year][id].getSaturday();
          break;
        }
        default: {
          times = this.busTimetable[this.year][id].getMondayToFriday();
          break;
        }
      }

      var unavailable = 0;

      for (var i = 0; i < times.length; i++) {
        var firstTime = '' + times[i][0];

        var split = firstTime.split(".");
        if ((split[0] == hours && split[1] < minutes) || (split[0] < hours)) {
          list.push({
            out: true,
            time: times[i]
          })

          unavailable += 1;
        } else {
          list.push({
            out: false,
            time: times[i]
          })
        }
      }

      list.reverse();

      if (list.length < 1 || list.length === unavailable) {
        list.unshift({
          out: true,
          time: [ "No available times today!" ]
        })
      }

      return list;
    },

    // Gets the web address for a particular bus route destination
    routeForTime(time) {
      return {
        name: 'new',
        params: { busRoute: this.busRoute, time: time, origin: this.origin, destination: this.destination }
      };
    },

    // Gets the web address for a particular bus route origin
    routeForOrigin(origin) {
      return {
        name: 'new',
        params: { busRoute: this.busRoute, time: this.time, origin: origin, destination: this.destination }
      };
    },

    // Gets the web address for a particular bus route origin
    routeForDest(dest) {
      return {
        name: 'new',
        params: { busRoute: this.busRoute, time: this.time, origin: this.origin, destination: dest}
      };
    },

    // Gets the web address for a particular bus route.
    routeForRoute(busRoute) {
      return {
        name: 'new',
        params: { busRoute: busRoute, time: this.time, origin: this.origin, destination: this.destination }
      };
    },

    // TIME

    prettyTime(time) {
      var stringTime = '' + time;
      if (!stringTime.includes(".") && !Number(stringTime)) return stringTime;

      var meridian = "pm";
      var split = stringTime.split(".");
      var hour = Number(split[0]);
      var minutes = split[1] || "00";

      if (minutes.length < 2) {
        minutes += "0";
      }

      if (hour <= 12) {
        meridian = "am";
      }

      if (hour > 12) {
        hour = hour - 12;
      }

      return hour + "." + minutes + " " + meridian.toUpperCase()
    },

    equals(first, second) {
      return {
        "bg-primary": first === second
      };
    }
  },
  computed: {
    originInformation: function() {
      if (this.getTimesById(this.busRoute)[this.time].time[this.origin] == null) return "Invalid time!"
      return this.getStopsRange(this.getBusById(this.busRoute))[this.origin].name + " : " + this.prettyTime(this.getTimesById(this.busRoute)[this.time].time[this.origin]);
    },
    destinationInformation: function() {
      if (this.getTimesById(this.busRoute)[this.time].time[this.destination] == null) return "Invalid time!"
      return this.getStopsRange(this.getBusById(this.busRoute))[this.destination].name + " : " + this.prettyTime(this.getTimesById(this.busRoute)[this.time].time[this.destination]);
    }
  }
}

// Router
//
// Router components addon to be added to the
// Vue instance.
//
// @author Connor Hartley
// @version 0.0.1

var router = new VueRouter({
  routes: [
    {
      name: 'main',
      path: '/',
      component: Plan
    },
    {
      name: 'new-route',
      path: '/plan/:busRoute',
      component: Plan
    },
    {
      name: 'new-route-time',
      path: '/plan/:busRoute/:time',
      component: Plan
    },
    {
      name: 'new-route-origin',
      path: '/plan/:busRoute/:time/:origin/',
      component: Plan
    },
    {
      name: 'new',
      path: '/plan/:busRoute/:time/:origin/:destination',
      component: Plan
    }
    // {
    //   name: 'view',
    //   path: '/view/:busRoute/:origin/:destination/:timeId',
    //   component: View
    // },
  ]
});

// Module Exports

module.exports = router;
