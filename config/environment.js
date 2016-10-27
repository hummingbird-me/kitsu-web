/* global module */

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

    contentSecurityPolicyHeader: 'Content-Security-Policy-Report-Only',
    contentSecurityPolicy: {
      'script-src': "'self' www.google-analytics.com d2j1fszo1axgmp.cloudfront.net",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'connect-src': "'self' www.google-analytics.com analytics.getstream.io",
      'img-src': "* data:",
      'font-src': "'self' fonts.gstatic.com",
      'frame-src': "'self' www.youtube.com https://staticxx.facebook.com http://staticxx.facebook.com"
    },

    'ember-simple-auth': {
      authenticationRoute: 'dashboard',
      routeIfAlreadyAuthenticated: 'dashboard',
      store: 'session-store:adaptive'
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: { id: 'UA-37633900-1' }
      },
      {
        name: 'Stream',
        environments: ['production'],
        config: {
          apiKey: '3byr477gj7mj',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiIqIiwidXNlcl9pZCI6IioiLCJyZXNvdXJjZSI6ImFuYWx5dGljcyJ9.Zxetf3_Zyh0Lb-wqx1L-RZ4c9wT7_ZW5-K9wn7Qq-_E'
        }
      }
    ],

    i18n: {
      defaultLocale: 'en'
    },

    moment: {
      allowEmpty: true
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
  }

  if (environment === 'production') {
    ENV.contentSecurityPolicyHeader = 'Content-Security-Policy';
  }

  ENV.FB = {
    appId: '1222641771096126',
    version: 'v2.5',
    xfbml: true
  }

  return ENV;
};
