/* eslint-env node */
const IS_STAGING_ENV = process.env.HEROKU_EMBER_APP === 'staging';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    EmberENV: {
      FEATURES: {}
    },
    APP: {
      APIHost: undefined,
      isStaging: IS_STAGING_ENV,
    },
    EXTEND_PROTOTYPES: {
      Date: false
    },

    torii: {
      providers: {
        'facebook-connect': {
          appId: '325314560922421',
          version: 'v2.8',
          scope: 'public_profile,email,user_friends'
        }
      }
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: { id: 'UA-37633900-4' }
      },
      {
        name: 'Stream',
        environments: ['production', 'staging', 'development'],
        config: {
          production: {
            apiKey: 'eb6dvmba4ct3',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.fXxS0SjjkETZRNvKOnv69RBtfxOaLPcrRNOqLuMmnV4'
          },
          staging: {
            apiKey: 'ekx6xkn9v9xx',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Loj_VZy_FKQzP3xLpX46xSF9bktOBfqcve8eYjwFmNc'
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

    sentry: {
      dsn: 'https://1c436e52d5a54f4a94339278c8bdbe77@sentry.io/151419',
      cdn: 'https://cdn.ravenjs.com/3.13.1/raven.min.js',
      development: environment !== 'production',
      debug: false,
      ravenOptions: {
        whitelistUrls: [/kitsu\.io/, /staging\.kitsu\.io/],
        ignoreErrors: ['TaskCancelation'],
        environment: IS_STAGING_ENV ? 'staging' : 'production'
      }
    },

    stream: {
      realtime: {
        enabled: true,
        config: {
          development: {
            key: 'sjm3sx9mgcx2',
            app: '17073'
          },
          staging: {
            key: 'ekx6xkn9v9xx',
            app: '17647'
          },
          production: {
            key: 'eb6dvmba4ct3',
            app: '18373'
          }
        }
      }
    },

    moment: {
      allowEmpty: true,
      includeTimezone: '2010-2020'
    },

    'polyfill-io': {
      features: ['Intl.~locale.en-US'],
      unknown: 'polyfill',
      rum: 0
    },

    'ember-cli-mirage': {
      enabled: environment === 'test'
    },

    google: {
      adwords: environment === 'production',
      ads: {
        enabled: environment === 'production',
        networkId: '20370372407'
      }
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_TRANSITIONS = false;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.torii.providers['facebook-connect'].appId = '1189964281083789';
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.APIHost = undefined;
    ENV.stream.realtime.enabled = false;
    ENV.intl_cp_validations = ENV.intl_cp_validations || {};
    ENV.intl_cp_validations.suppressWarnings = true;
  }

  // Staging app @ Heroku
  if (process.env.HEROKU_EMBER_APP === 'staging') {
    ENV.APP.APIHost = 'https://staging.kitsu.io';
  }

  // Production app @ Heroku
  if (environment === 'production' && process.env.HEROKU_EMBER_APP !== 'staging') {
    ENV.APP.APIHost = 'https://kitsu.io';
  }

  // Heroku environment - So that we can append the git hash to the version
  if (process.env.HEROKU_EMBER_APP) {
    ENV.APP.heroku = true;
    if (process.env.HEROKU_SLUG_COMMIT) {
      ENV.APP.gitCommit = process.env.HEROKU_SLUG_COMMIT.slice(0, 7);
    }
  }

  return ENV;
};
