/* eslint-disable */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    storeConfigInMeta: false,
    babel: {
      includePolyfill: true
    },
    sassOptions: {
      includePaths: ['bower_components/bootstrap/scss']
    },
    postcssOptions: {
      compile: { enabled: false },
      filter: {
        enabled: true,
        plugins: [
          { module: require('postcss-flexbugs-fixes') },
          {
            module: require('autoprefixer'),
            options: {
              browsers: ['> 1%', 'last 2 versions']
            }
          }
        ]
      }
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('bower_components/tether/dist/js/tether.min.js');
  app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
  app.import('bower_components/nouislider/distribute/nouislider.js');
  app.import('bower_components/nouislider/distribute/nouislider.min.css');
  app.import('bower_components/humanize-duration/humanize-duration.js');
  app.import('bower_components/flickity/dist/flickity.min.css');
  app.import('bower_components/flickity/dist/flickity.pkgd.min.js');
  app.import('bower_components/clipboard/dist/clipboard.min.js');
  app.import('bower_components/autosize/dist/autosize.min.js');
  app.import('bower_components/jquery-hoverintent/jquery.hoverIntent.js');
  app.import('bower_components/getstream/dist/js_min/getstream.js');

  return app.toTree();
};
