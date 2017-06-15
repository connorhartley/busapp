/*************************************************************
 * App Script - The script class in which the app uses.
 *************************************************************/

// General Imports

var Vue = require('vue');

var fs = require('fs');

// Templates
//
// Templates for specific components with data
// attatched.
//
// @author Connor Hartley
// @version 0.0.3

// Navigation Plate
var templateNavigationPlate = fs.readFileSync(__dirname + '/templates/navigation-plate.html', 'utf8');

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
    changeTab: function (to) {
      this.$emit('update:pageIndex', to);
    }
  }
});

// Footer Plate
Vue.component('footer-plate', {
  template: templateFooterPlate
});

// VueJS Base

new Vue({
  el: '#app',
  data: function () {
    return {
      pageIndex: 0,

      pages: [
        {
          id: 'select',
          displayId: 'Select',
          isActive: true
        },
        {
          id: 'timetable',
          displayId: 'Timetable',
          isActive: false
        },
        {
          id: 'account',
          displayId: 'Account',
          isActive: false
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
    // Updates the content for children components due to a page change.
    updatePage: function (to, from) {
      if (!this.pages[to].isActive) {
        this.pages[from].isActive = false;

        this.pages[to].isActive = true;
        this.pageIndex = to;
      }
    }
  }
});
