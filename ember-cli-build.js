/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const PostCSSFlex = require('postcss-flexbugs-fixes');
const Autoprefixer = require('autoprefixer');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      comments: false
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    sassOptions: {
      includePaths: ['bower_components/bootstrap/scss']
    },
    postcssOptions: {
      compile: { enabled: false },
      filter: {
        enabled: true,
        plugins: [
          { module: PostCSSFlex },
          {
            module: Autoprefixer,
            options: { browsers: ['> 1%', 'last 2 versions'] }
          }
        ]
      }
    },
    // can be removed when ember-web-app supports mstile
    fingerprint: {
      exclude: [
        'mstile-70x70.png',
        'mstile-150x150.png',
        'mstile-310x150.png',
        'mstile-310x310.png'
      ]
    },
    svgJar: {
      optimizer: {
        plugins: [
          { removeTitle: true },
          { removeDesc: true },
          { removeXMLNS: true }
        ]
      }
    }
  });

  app.import('bower_components/tether/dist/js/tether.min.js');
  app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
  app.import('bower_components/nouislider/distribute/nouislider.js');
  app.import('bower_components/nouislider/distribute/nouislider.min.css');
  app.import('bower_components/flickity/dist/flickity.min.css');
  app.import('bower_components/clipboard/dist/clipboard.min.js');
  app.import('bower_components/autosize/dist/autosize.min.js');
  app.import('bower_components/jquery-hoverintent/jquery.hoverIntent.js');
  app.import('bower_components/getstream/dist/js_min/getstream.js');

  return app.toTree();
};
