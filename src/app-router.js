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
      map: null,
      markers: [],
      paths: [],
      busRoute: "",
      defaultRoute: "awapuni",
      origin: 0,
      destination: 0,
      time: 0
    }
  },
  created() {
    // Sets URL to default parameters, unless specified otherwise.
    this.checkData()
  },
  watch: {
    // When the route for this component changes, call checkData.
    // This is usually done using a router-link from a setting
    // that has changed during a dropdown.
    $route: 'checkData'
  },
  methods: {
    // Updates the URL and updates data to match response from URL parameters.
    checkData() {
      if (!this.$route.params.busRoute) {
        // Default bus route is set if there is none in the URL and return.
        this.busRoute = this.defaultRoute;
        return;
      } else {
        // If origin, destination or time are not set in the url, replace them with the defaults.
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

      // If the bus route doesn't equal the bus route in the url
      // set all other values to their default.
      // (This is for if you change route, so the code doesn't get confused
      //  with a range that does not exist.)
      //
      // Otherwise update the data for time, origin and destination.
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

      // Update the data for bus route.
      this.busRoute = this.$route.params.busRoute

      // Update the map.
      this.updateMap();
    },

    // Updates the google map to show the latest user set information.
    updateMap() {
      // Markers

      var oTime = this.getTimesById(this.busRoute)[this.time].time[this.origin];
      var dTime = this.getTimesById(this.busRoute)[this.time].time[this.destination];

      if (oTime == null || dTime == null) return;

      // Sets marker maps to null to remove them from the map.
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });

      // Clears the markers array data.
      this.markers = [];

      // Pushes a new google maps marker for the origin position.
      this.markers.push(new google.maps.Marker({
        map: this.map,
        position: this.getBusById(this.busRoute).getCoordinates()[this.origin],
        title: this.getStopsRange(this.getBusById(this.busRoute))[this.origin].name,
        icon: './images/red_MarkerA.png'
      }));

      // Pushes a new google maps marker for the destination position.
      this.markers.push(new google.maps.Marker({
        map: this.map,
        position: this.getBusById(this.busRoute).getCoordinates()[this.destination],
        title: this.getStopsRange(this.getBusById(this.busRoute))[this.destination].name,
        icon: './images/blue_MarkerB.png'
      }));

      // Paths

      // Sets paths maps to null to remove them from the map.
      this.paths.forEach((path) => {
        path.setMap(null);
      });

      // Clears the paths array data.
      this.paths = [];

      // Pushes a new google maps polyline for the bus route path.
      this.paths.push(new google.maps.Polyline({
        map: this.map,
        path: this.getBusById(this.busRoute).getPaths(),
        geodesic: true,
        strokeColor: this.getBusById(this.busRoute).getColour(),
        strokeOpacity: 0.8,
        strokeWeight: 3.5
      }))
    },

    // Returns the bus route object by its id.
    getBusById(id) {
      return this.busTimetable[this.year][id];
    },

    // Returns an array of stops using the bus object.
    getStopsRange(bus) {
      var list = [];

      // Loop that produces the red bolded stops that are not available
      // in the stop range dropdowns.
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

    // Returns an array of times reversed for time range selection using the bus id.
    getTimesById(id) {
      var day = this.date.getDay();
      var hours = this.date.getHours();
      var minutes = this.date.getMinutes();
      var times;
      var list = [];

      // Returns the correct list of times for the specific days.
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

      // Loop that produces the red bolded times that are not available
      // in the time range dropdowns.
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

      // Reverses the list.
      list.reverse();

      // Adds "No available times today!" if there are no times
      // in the list OR all the times in the list have become
      // unavailable.
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

    // Takes a number or string, with a 24-hour time like `9.0`, `18.2` or `13.50` and returns a string with a
    // prettier more understandable 12-hour time format with AM and PM.
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

      // Changes meridian to am if it is before 12pm
      if (hour < 12) {
        meridian = "am";
      }

      // Changes 24-hour time to 12-hour time.
      if (hour > 12) {
        hour = hour - 12;
      }

      // Wraps the modified values up into a nice human readable string.
      return hour + "." + minutes + " " + meridian.toUpperCase()
    },

    // Checks if the first equals the second and returns a style
    // for the background primary colour to be used for selections
    // in the dropdowns.
    equals(first, second) {
      return {
        "bg-primary": first === second
      };
    }
  },
  computed: {
    // Produces a string with the time and stop on it for the origin position.
    originInformation: function() {
      if (this.getTimesById(this.busRoute)[this.time].time[this.origin] == null) return "Invalid time!"
      return this.getStopsRange(this.getBusById(this.busRoute))[this.origin].name + " : " + this.prettyTime(this.getTimesById(this.busRoute)[this.time].time[this.origin]);
    },

    // Produces a string with the time and stop on it for the destination position.
    destinationInformation: function() {
      if (this.getTimesById(this.busRoute)[this.time].time[this.destination] == null) return "Invalid time!"
      return this.getStopsRange(this.getBusById(this.busRoute))[this.destination].name + " : " + this.prettyTime(this.getTimesById(this.busRoute)[this.time].time[this.destination]);
    }
  },
  mounted: function() {
    // Creates a google map object and uses it to define the data `map` when this component is mounted to the DOM.
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -40.3569244,
        lng: 175.6095111
      },
      zoom: 12,
      gestureHandling: 'none',
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      scrollwheel: false
    });
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
