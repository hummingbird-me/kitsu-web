/* eslint-disable */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'client',
    podModulePrefix: 'client/routes',
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

    // ember-cli-content-security-policy
    contentSecurityPolicyHeader: 'Content-Security-Policy-Report-Only',
    contentSecurityPolicy: {
      'script-src': "'self' www.google-analytics.com d2j1fszo1axgmp.cloudfront.net connect.facebook.net graph.facebook.com faye.getstream.io widget.intercom.io js.intercomcdn.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'connect-src': "'self' www.google-analytics.com analytics.getstream.io wss://faye.getstream.io *.intercom.io wss://*.intercom.io",
      'img-src': '* data:',
      'font-src': "'self' fonts.gstatic.com js.intercomcdn.com",
      'frame-src': "'self' www.youtube.com *.facebook.com",
      'media-src': "'self' js.intercomcdn.com"
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
        config: { id: 'UA-37633900-1' }
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
    ENV.contentSecurityPolicyHeader = 'Content-Security-Policy';
    ENV.torii.providers['facebook-connect'].appId = '189034391502520';
    ENV.metricsAdapters[2].config.production.apiKey = 'ekx6xkn9v9xx';
    ENV.metricsAdapters[2].config.production.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Loj_VZy_FKQzP3xLpX46xSF9bktOBfqcve8eYjwFmNc';
  }

  if (environment === 'production' && process.env.HEROKU_EMBER_APP !== 'staging') {
    ENV.contentSecurityPolicyHeader = 'Content-Security-Policy';
    ENV.torii.providers['facebook-connect'].appId = '325314560922421';
    ENV.stream.realtime.key = '3byr477gj7mj';
    ENV.stream.realtime.app = '16897';
    ENV.metricsAdapters[1].config.appId = 'ca7x05fo';
  }

  return ENV;
};
