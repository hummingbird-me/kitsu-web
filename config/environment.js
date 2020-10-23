/* eslint-env node */
// https://github.com/moment/moment/tree/2.27.0/locale
const LANGUAGE_CODES = [
  'en',
  'ar',
  'ca',
  'cs',
  'de',
  'en-gb',
  'eo',
  'es',
  'fr-ca',
  'fr',
  'hu',
  'id',
  'it',
  'nl',
  'nb',
  'pl',
  'pt-br',
  'pt',
  'ru',
  'sv',
  'tl-ph',
  'tr',
  'zh-cn'
];

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
      APIHost: 'https://kitsu.io',
      isStaging: IS_STAGING_ENV,
      isProduction: environment === 'production',
      env: environment
    },

    torii: {
      providers: {
        'facebook-connect': {
          appId: '325314560922421',
          version: 'v6.0',
          scope: 'public_profile,email'
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
            apiKey: 'gxzv2wchqpd3',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6ImFuYWx5dGljcyIsImFjdGlvbiI6IioiLCJ1c2VyX2lkIjoiKiJ9.ggV4B3jmTxcdMqHSjxoXk0kOYKu0YtC2u4fyeuCq3Qs'
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
        config: { id: '1372973436170230' }
      },
      {
        name: 'TwitterPixel',
        environments: ['production'],
        config: { id: 'nz90m' }
      }
    ],

    sentry: {
      dsn: 'https://1c436e52d5a54f4a94339278c8bdbe77@sentry.io/151419',
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
            key: 'gxzv2wchqpd3',
            app: '40293'
          }
        }
      }
    },

    algolia: {
      appId: 'AWQO5J657S'
    },

    moment: {
      allowEmpty: true,
      includeTimezone: 'subset',
      includeLocales: LANGUAGE_CODES
    },

    'ember-cli-mirage': {
      enabled: environment === 'test',
      excludeFilesFromBuild: environment !== 'test',
      discoverEmberDataModels: true
    },

    'polyfill-io': {
      min: true,
      features: [
        'default',
        'Intl',
        'IntersectionObserver',
        'fetch'
      ],
      flags: ['gated'],
      unknown: 'polyfill'
    },

    google: {
      adwords: environment === 'production',
      ads: {
        enabled: false, // environment === 'production',
        networkId: '20370372407'
      }
    },

    onesignal: {
      production: {
        appId: '01f6e47a-6809-4118-a796-949952e9c209'
      },
      staging: {
        appId: '9933b0ac-ca94-4990-931b-7efa6bafdfd6'
      },
      development: {
        appId: '9933b0ac-ca94-4990-931b-7efa6bafdfd6'
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
    ENV['ember-cli-mirage'] = {
      excludeFilesFromBuild: true
    };
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';

    ENV.kitsu.APIHost = undefined;
    ENV.kitsu.env = 'development';
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

  ENV.apollo = { apiURL: `${ENV.kitsu.APIHost}/api/edge/graphql` };

  return ENV;
};
