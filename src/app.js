/*************************************************************
 * App Script - The script class in which the app uses.
 *************************************************************/

// General Imports

var Vue = require('vue');
var VueRouter = require('vue-router');

var fs = require('fs');

var router = require('./app-router');

var timetable = require('./data/timetable');

// Templates
//
// Templates for specific components with data
// attatched.
//
// @author Connor Hartley
// @version 0.0.3

// Navigation Plate
var templateNavigationPlate = fs.readFileSync(__dirname + '/templates/navigation-plate.html', 'utf8');

// Content Plate
var templateContentPlate = fs.readFileSync(__dirname + '/templates/content-plate.html', 'utf8');

// Footer Plate
var templateFooterPlate = fs.readFileSync(__dirname + '/templates/footer-plate.html', 'utf8');

// Components
//
// Components containing a specific set of data
// and states, each connected to a template.
//
// @author Connor Hartley
// @version 0.0.4

// Navigation Plate
Vue.component('navigation-plate', {
  template: templateNavigationPlate,
  props: [ 'page-index', 'pages' ],
  methods: {
    // Function for changing the menu tab. Emits an event to update content.
    changeTab: function (to) {
      this.$emit('update:pageIndex', to);
    }
  }
});

// Content Plate

Vue.component('content-plate', {
  template: templateContentPlate
});

// Footer Plate
Vue.component('footer-plate', {
  template: templateFooterPlate
});

// VueJS Base

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router: router,
  data: function () {
    return {
      pageIndex: 0,

      pages: [
        {
          id: 'select',
          displayId: 'Select',
          isActive: true,
          isDeactivated: false
        },
        {
          id: 'timetable',
          displayId: 'Timetable',
          isActive: false,
          isDeactivated: false
        },
        {
          id: 'account',
          displayId: 'Account',
          isActive: false,
          isDeactivated: true
        },
      ],

      busTimetable: timetable(),

      selection: {
        yearId: "y2017",
        routeId: "",
        originId: 0,
        destinationId: 0
      },

      date: new Date(),
    }
  },
  watch: {
    // Watch for the page index to change.
    pageIndex: function (newIndex, oldIndex) {
      this.updatePage(newIndex, oldIndex);
    },

    selection: function (newSelection, oldSelection) {
      this.updateSelection(newSelection, oldSelection);
    }
  },
  methods: {
    // Updates the content for children components due to a page index change.
    updatePage: function (to, from) {
      if (!this.pages[to].isDeactivated) {
        if (!this.pages[to].isActive) {
          this.pages[from].isActive = false;

          this.pages[to].isActive = true;
          this.pageIndex = to;

          // Update the content router view.
          this.$router.push({ name: this.pages[to].id });
        }
      } else {
        this.pageIndex = from;
      }
    },

    updateSelection: function (to, from) {
      if (to instanceof {}) {
        if (!(to.originId < to.destinationId) && to.originId != 0) {
          var times;

          switch (this.dayFromDate()) {
            case 0: times = busTimetable[to.yearId][to.routeId].getSunday();
            case 5: times = busTimetable[to.yearId][to.routeId].getFinalFriday();
            case 6: times = busTimetable[to.yearId][to.routeId].getSaturday();
            default: times = busTimetable[to.yearId][to.routeId].getMondayToFriday();
          }
        }
      }
    }
  },
  compute: {
    dayFromDate: function() {
      return this.date.getDay();
    }
  }
});
