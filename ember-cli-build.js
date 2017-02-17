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
      includePaths: ['node_modules/bootstrap/scss']
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
    },
    nodeAssets: {
      autosize: {
        srcDir: 'dist',
        import: ['autosize.js']
      },
      blockadblock: {
        import: ['blockadblock.js']
      },
      clipboard: {
        srcDir: 'dist',
        import: ['clipboard.js']
      },
      getstream: {
        srcDir: 'dist/js',
        import: ['getstream.js']
      },
      hoverintent: {
        srcDir: 'dist',
        import: ['hoverintent.min.js']
      },
      nouislider: {
        srcDir: 'distribute',
        import: ['nouislider.css', 'nouislider.js']
      },
      zxcvbn: {
        srcDir: 'dist',
        import: [{
          path: 'zxcvbn.js',
          sourceMap: 'zxcvbn.js.map'
        }]
      }
    }
  });

  return app.toTree();
};
