import Ember from 'ember';
import { later } from 'ember-runloop';

export function initialize() {
  Ember.onerror = function(error) {
    /**
     * `SecurityError: DOM Exception 18` is thrown by Safari (iOS/OSX) when
     * pushState is used >= 100 times within 30 seconds. This will reload browsers
     * that hit this limit.
    */
    if (error.name === 'SecurityError' && error.code === 18) {
      return later(() => window.location.reload());
    }

    // Log the error to console
    console.error(error);
  };
}

export default {
  name: 'onerror',
  initialize
};
