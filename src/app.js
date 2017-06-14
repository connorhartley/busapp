/*************************************************************
 * App Script - The script class in which the app uses.
 *************************************************************/

// General Imports

var Vue = require('vue');

// Templates
//
// Templates for specific components with data
// attatched.
//
// @author Connor Hartley
// @version 0.0.3

// Navigation Plate
var templateNavigationPlate =
`<div class="plate-navigation navigation">
  <a href="#"><div class="navigation-brand">
    <img src="./dist/images/bus-small.png">
  </div></a>

  <div class="navigation-menu">
    <a href="#"><div class="menu-element bg-primary">
      Select
    </div></a>

    <a href="#"><div class="menu-element">
      Timetable
    </div></a>

    <a href="#"><div class="menu-element">
      Account
    </div></a>
  </div>
</div>`;

// Footer Plate
var templateFooterPlate =
`<div class="plate-footer footer">
  <a href="#"><div class="menu-element">
    Previous
  </div></a>

  <a href="#"><div class="menu-element">
    Next
  </div></a>
</div>`;

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
