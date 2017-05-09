import Ember from 'ember';
import { later } from 'ember-runloop';
import config from 'client/config/environment';

export function initialize() {
  Ember.onerror = function(error) {
    /**
     * `SecurityError: DOM Exception 18` is thrown by Safari (iOS/OSX) when
     * pushState is used >= 100 times within 30 seconds. This will reload browsers
     * that hit this limit.
    */
    if (error.name === 'SecurityError' && error.code === 18) {
      return later(() => window.location.reload(), 1);
    }

    if (config.environment === 'development') {
      Ember.Logger.error(error);
    }
  };
}

export default {
  name: 'onerror',
  initialize,
  before: 'raven'
};
