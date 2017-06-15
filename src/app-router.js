/*************************************************************
 * Router Script - The script which manages the router.
 *************************************************************/

var fs = require('fs');

var vuerouter = require('vue-router');

// Templates
//
// Templates for specific components with data
// attatched.
//
// @author Connor Hartley
// @version 0.0.1

// Content Test
var templateContentTest = fs.readFileSync(__dirname + '/templates/content/content-test.html', 'utf8');

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

var router = new vuerouter({
  routes: [
    {
      path: '/',
      component: contentTest
    }
  ]
});

// Module Exports

module.exports = router;
