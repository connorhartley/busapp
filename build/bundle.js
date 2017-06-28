var browserify = require('browserify');
var fs = require('fs');

// Relocation
var stepperStyle = fs.createReadStream('./node_modules/mdl-stepper/stepper.min.css')
stepperStyle.pipe(fs.createWriteStream('dist/styles/extra/stepper.min.css'))

stepperStyle.on('error', function(err) {
  throw err;
})

// Bundling
var b = browserify('src/app.js');

b.transform('brfs')

b.bundle().pipe(fs.createWriteStream('dist/scripts/bundle.js'))
