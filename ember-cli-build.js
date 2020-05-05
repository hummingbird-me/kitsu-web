const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const PostCSSFlex = require('postcss-flexbugs-fixes');
const Autoprefixer = require('autoprefixer');
const svgoUniqueIds = require('svgo-plugin-unify-ids');
const sass = require('sass');
const targets = require('./config/targets');

const environment = EmberApp.env();
const IS_PROD = environment === 'production';
const IS_TEST = environment === 'test';
const IS_DEV = environment === 'development';

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    browseryStats: IS_DEV,
    hinting: IS_TEST,
    tests: IS_TEST,

    babel: {
      plugins: ['@babel/plugin-proposal-object-rest-spread']
    },

    'ember-cli-babel': {
      includePolyfill: IS_PROD
    },

    'ember-cli-password-strength': {
      bundleZxcvbn: false
    },

    autoprefixer: {
      sourcemaps: false
    },

    sourcemaps: {
      enabled: IS_PROD,
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
      implementation: sass,
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

    fingerprint: {
      generateAssetMap: true,
      fingerprintAssetMap: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'json'],
      exclude: [
        'OneSignalSDKWorker.js',
        'OneSignalSDKUpdaterWorker.js',

        'apple-app-site-association',

        // can be removed when ember-web-app supports mstile
        'mstile-70x70.png',
        'mstile-150x150.png',
        'mstile-310x150.png',
        'mstile-310x310.png',

        'hulu-embed-frame.html'
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
    },

    emberApolloClient: {
      keepGraphqlFileExtension: false
    }
  });

  // Work around for Ember 2.16.2 and Sourcemaps in production
  app.import('node_modules/zxcvbn/dist/zxcvbn.js.map', { destDir: '.' });
  app.import('node_modules/algoliasearch/dist/algoliasearchLite.min.js', {
    using: [
      { transformation: 'amd', as: 'algoliasearch' }
    ]
  });
  app.import('node_modules/text-clipper/dist/index.js', {
    using: [
      { transformation: 'cjs', as: 'text-clipper' }
    ]
  });

  return app.toTree();
};
