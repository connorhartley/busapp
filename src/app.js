/*************************************************************
 * App Script - The script class in which the app uses.
 *************************************************************/

// General Imports

var Vue = require('vue');
var VueRouter = require('vue-router');

var fs = require('fs');

var router = require('./app-router');

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
    }
  },
  watch: {
    // Watch for the page index to change.
    pageIndex: function (newIndex, oldIndex) {
      this.updatePage(newIndex, oldIndex);
    }
  },
  methods: {
    // Updates the content for children components due to a page index change.
    updatePage: function (to, from) {
      if (!this.pages[to].isActive && !this.pages[to].isDeactivated) {
        this.pages[from].isActive = false;

        this.pages[to].isActive = true;
        this.pageIndex = to;

        // Update the content router view.
        this.$router.push({ name: this.pages[to].id });
      }
    }
  }
});
