/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const PostCSSFlex = require('postcss-flexbugs-fixes');
const Autoprefixer = require('autoprefixer');
const svgoUniqueIds = require('svgo-plugin-unify-ids');
const targets = require('./config/targets');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    browseryStats: EmberApp.env() === 'development',

    babel: {
      comments: false,
      plugins: ['transform-object-rest-spread']
    },

    'ember-cli-babel': {
      includePolyfill: true
    },

    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },

    outputPaths: {
      app: {
        css: {
          'light-theme': '/assets/light.css',
          'dark-theme': '/assets/dark.css'
        }
      }
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
          { module: Autoprefixer,
            options: { browsers: targets.browsers }
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
      persist: false,
      optimizer: {
        plugins: [
          { removeTitle: true },
          { removeDesc: true },
          { removeXMLNS: true },
          { uniqueIds: svgoUniqueIds }
        ]
      }
    },

    // addons
    'ember-composable-helpers': {
      only: [
        // Action
        'pipe', 'toggle', 'queue',
        // Array
        'array', 'map-by', 'sort-by', 'filter-by', 'reject-by',
        'find-by', 'take', 'repeat',
        // Object
        'group-by',
        // Math
        'inc'
      ]
    },

    'ember-cli-string-helpers': {
      only: ['capitalize', 'classify', 'html-safe', 'truncate', 'w']
    },

    // assets
    nodeAssets: {
      autosize: {
        srcDir: 'dist',
        import: ['autosize.js']
      },
      clipboard: {
        srcDir: 'dist',
        import: ['clipboard.js']
      },
      cropperjs: {
        srcDir: 'dist',
        import: ['cropper.css', 'cropper.js']
      },
      flickity: {
        srcDir: 'dist',
        import: ['flickity.css']
      },
      getstream: {
        srcDir: 'dist/js',
        import: ['getstream.js']
      },
      hoverintent: {
        srcDir: 'dist',
        import: ['hoverintent.min.js']
      }
    }
  });

  return app.toTree();
};
