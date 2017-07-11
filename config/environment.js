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
    APP: {},
    EXTEND_PROTOTYPES: {
      Date: false
    },

    kitsu: {
      APIHost: 'https://staging.kitsu.io',
      isStaging: IS_STAGING_ENV,
      env: process.env.HEROKU_EMBER_APP || 'development'
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
        name: 'GoSquared',
        environments: ['production'],
        config: { id: 'GSN-662857-Q' }
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
      cdn: 'https://cdn.ravenjs.com/3.15.0/raven.min.js',
      development: environment !== 'production',
      debug: environment !== 'production',
      ravenOptions: {
        whitelistUrls: [
          'kitsu.io/assets',
          'staging.kitsu.io/assets'
        ],
        includePaths: [/https?:\/\/(staging\.)?kitsu\.io/],
        environment: process.env.HEROKU_EMBER_APP
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
      includeTimezone: 'subset'
    },

    'ember-cli-mirage': {
      enabled: environment === 'test',
      excludeFilesFromBuild: environment !== 'test',
      discoverEmberDataModels: true
    },

    'polyfill-io': {
      min: true,
      features: [
        'default-3.6',
        'Intl.~locale.en-US'
      ],
      flags: ['gated'],
      unknown: 'polyfill',
      rum: 0
    },

    google: {
      adwords: environment === 'production',
      ads: {
        enabled: environment === 'production',
        networkId: '20370372407'
      }
    },

    embedly: {
      apiKey: '90f3fb8ff40f4603991aa258127ccb5e'
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

    ENV.kitsu.APIHost = undefined;
    ENV.stream.realtime.enabled = false;
    ENV.intl_cp_validations = ENV.intl_cp_validations || {};
    ENV.intl_cp_validations.suppressWarnings = true;
  }

  // Heroku environment - So that we can append the git hash to the version
  if (process.env.HEROKU_EMBER_APP) {
    ENV.release = process.env.SOURCE_VERSION || process.env.HEROKU_SLUG_COMMIT || '-';
  }

  // Staging app @ Heroku
  if (process.env.HEROKU_EMBER_APP === 'staging') {
    ENV.kitsu.APIHost = 'https://staging.kitsu.io';
  }

  // Production app @ Heroku
  if (process.env.HEROKU_EMBER_APP === 'production') {
    ENV.kitsu.APIHost = 'https://kitsu.io';
  }

  return ENV;
};
