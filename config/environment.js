/* eslint-disable */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'client',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    EXTEND_PROTOTYPES: {
      Date: false
    },
    isStaging: process.env.HEROKU_EMBER_APP === 'staging',

    // ember-simple-auth
    'ember-simple-auth': {
      authenticationRoute: 'dashboard',
      routeIfAlreadyAuthenticated: 'dashboard',
      store: 'session-store:adaptive'
    },

    // torii
    torii: {
      providers: {
        'facebook-connect': {
          appId: '1189964281083789',
          version: 'v2.8',
          scope: 'public_profile,email,user_friends'
        }
      }
    },

    // ember-metrics
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: { id: 'UA-37633900-4' }
      },
      {
        name: 'Heap',
        environments: ['production'],
        config: { appId: '3718300691', enabled: true }
      },
      {
        name: 'Intercom',
        environments: ['production', 'development'],
        config: { appId: 'elre1t9q' }
      },
      {
        name: 'Stream',
        environments: ['production', 'development'],
        config: {
          production: {
            apiKey: 'eb6dvmba4ct3',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.fXxS0SjjkETZRNvKOnv69RBtfxOaLPcrRNOqLuMmnV4'
          },
          development: {
            apiKey: 'sjm3sx9mgcx2',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.PwcarwpGmUWY57rhorNKYPbTOZt0ppmX2U4AyYwzrw0'
          }
        }
      },
      {
        name: 'FacebookPixel',
        environments: ['production'],
        config: { id: '237149646711154' }
      }
    ],

    // ember-cli-sentry
    sentry: {
      dsn: 'https://9c9c723278a1456299a9da5842251bdf@sentry.io/119044',
      cdn: 'https://cdn.ravenjs.com/3.9.1/raven.min.js',
      development: environment !== 'production',
      whitelistUrls: [/https?:\/\/((staging)\.)?kitsu\.io/],
      ravenOptions: {
        ignoreErrors: [
          // Random plugins/extensions
          'top.GLOBALS',
          // Facebook borked
          'fb_xd_fragment'
        ],
        ignoreUrls: [
          // Facebook flakiness
          /graph\.facebook\.com/i,
          // Facebook blocked
          /connect\.facebook\.net\/en_US\/all\.js/i,
          // Chrome extensions
          /extensions\//i,
          /^chrome:\/\//i,
        ]
      }
    },

    // ember-i18n
    i18n: {
      defaultLocale: 'en'
    },

    // ember-moment
    moment: {
      allowEmpty: true,
      includeTimezone: '2010-2020'
    },

    // ember-cli-mirage
    'ember-cli-mirage': {
      enabled: environment === 'test'
    },

    stream: {
      realtime: {
        enabled: true,
        key: 'sjm3sx9mgcx2',
        app: '17073'
      }
    },

    google: {
      adwords: false,
      ads: {
        enabled: false,
        client: undefined
      }
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_TRANSITIONS = false;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.stream.realtime.enabled = false;
  }

  // Staging app @ Heroku
  if (process.env.HEROKU_EMBER_APP === 'staging') {
    // facebook app id
    ENV.torii.providers['facebook-connect'].appId = '325314560922421';
    // google analytics
    ENV.metricsAdapters[0].config.id = 'UA-37633900-3';
    // Heap
    ENV.metricsAdapters[1].config.enabled = false;
    // Stream
    ENV.metricsAdapters[3].config.production.apiKey = 'ekx6xkn9v9xx';
    ENV.metricsAdapters[3].config.production.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Loj_VZy_FKQzP3xLpX46xSF9bktOBfqcve8eYjwFmNc';
    ENV.stream.realtime.key = 'ekx6xkn9v9xx';
    ENV.stream.realtime.app = '17647';
    // Sentry
    ENV.sentry.dsn = 'https://cd7634b1400644688ff55bda89171367@sentry.io/125035';
  }

  if (environment === 'production' && process.env.HEROKU_EMBER_APP !== 'staging') {
    // facebook app id
    ENV.torii.providers['facebook-connect'].appId = '325314560922421';
    // stream app
    ENV.stream.realtime.key = 'eb6dvmba4ct3';
    ENV.stream.realtime.app = '18373';
    // intercom app
    ENV.metricsAdapters[2].config.appId = 'ca7x05fo';
    // google settings
    ENV.google.ads.enabled = true;
    ENV.google.ads.client = 'ca-pub-1730996169473196';
    ENV.google.adwords = true;
  }

  // Heroku environment - So that we can append the git hash to the version
  if (process.env.HEROKU_EMBER_APP) {
    ENV.APP.heroku = true;
    if (process.env.HEROKU_SLUG_COMMIT) {
      ENV.APP.herokuCommit = process.env.HEROKU_SLUG_COMMIT.slice(0, 7);
    }
  }

  return ENV;
};
