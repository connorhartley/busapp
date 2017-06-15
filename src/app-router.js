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
var templateContentTest = fs.readFileSync(__dirname + '/templates/content/content-dashboard.html', 'utf8');

// Components
//
// Components containing a specific set of data
// and states, each connected to a template.
//
// @author Connor Hartley
// @version 0.0.1

var contentTest = {
  template: templateContentTest
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
      path: '/',
      component: contentTest
    }
  ]
});

// Module Exports

module.exports = router;
