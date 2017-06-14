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
// @version 0.0.1

// Navigation Plate
Vue.component('navigation-plate', {
  template: templateNavigationPlate
});

// Footer Plate
Vue.component('footer-plate', {
  template: templateFooterPlate
});

// VueJS Base

new Vue({
  el: '#app'
});