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

// Content Dashboard
var templateContentDash = fs.readFileSync(__dirname + '/templates/content/content-dashboard.html', 'utf8');

// Content Timetable
var templateContentTimetable = fs.readFileSync(__dirname + '/templates/content/content-timetable.html', 'utf8');

// Content Account
var templateContentAccount = fs.readFileSync(__dirname + '/templates/content/content-account.html', 'utf8');

// Components
//
// Components containing a specific set of data
// and states, each connected to a template.
//
// @author Connor Hartley
// @version 0.0.1

var contentDash = {
  template: templateContentDash
}

var contentTimetable = {
  template: templateContentTimetable
}

var contentAccount = {
  template: templateContentAccount
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
      name: 'select',
      path: '/',
      component: contentDash
    },
    {
      name: 'timetable',
      path: '/timetable',
      component: contentTimetable
    },
    {
      name: 'account',
      path: '/account',
      component: contentAccount
    }
  ]
});

// Module Exports

module.exports = router;