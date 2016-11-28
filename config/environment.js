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
        name: 'Intercom',
        environments: ['production', 'development'],
        config: { appId: 'elre1t9q' }
      },
      {
        name: 'Stream',
        environments: ['production', 'development'],
        config: {
          production: {
            apiKey: '3byr477gj7mj',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Zxetf3_Zyh0Lb-wqx1L-RZ4c9wT7_ZW5-K9wn7Qq-_E'
          },
          development: {
            apiKey: 'sjm3sx9mgcx2',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.PwcarwpGmUWY57rhorNKYPbTOZt0ppmX2U4AyYwzrw0'
          }
        }
      }
    ],

    // ember-i18n
    i18n: {
      defaultLocale: 'en'
    },

    // ember-moment
    moment: {
      allowEmpty: true
    },

    stream: {
      realtime: {
        enabled: true,
        key: 'sjm3sx9mgcx2',
        app: '17073'
      }
    },

    ads: {
      enabled: false,
      client: undefined
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

  if (process.env.HEROKU_EMBER_APP === 'staging') {
    ENV.torii.providers['facebook-connect'].appId = '189034391502520';
    ENV.metricsAdapters[0].config.id = 'UA-37633900-3';
    ENV.metricsAdapters[2].config.production.apiKey = 'ekx6xkn9v9xx';
    ENV.metricsAdapters[2].config.production.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Loj_VZy_FKQzP3xLpX46xSF9bktOBfqcve8eYjwFmNc';
    ENV.stream.realtime.key = 'ekx6xkn9v9xx';
    ENV.stream.realtime.app = '17647';
  }

  if (environment === 'production' && process.env.HEROKU_EMBER_APP !== 'staging') {
    ENV.torii.providers['facebook-connect'].appId = '325314560922421';
    ENV.stream.realtime.key = '3byr477gj7mj';
    ENV.stream.realtime.app = '16897';
    ENV.metricsAdapters[1].config.appId = 'ca7x05fo';
    ENV.ads.enabled = true;
    ENV.ads.client = 'TODO-HERE';
  }

  return ENV;
};
