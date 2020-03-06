import Ember from 'ember';
import { later } from '@ember/runloop';

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

    console.error(error);

    /**
     * An Ember.onerror handler _must_ rethrow exceptions when `Ember.testing` is
     * `true` or the test suite is unreliable.
     */
    if (Ember.testing) {
      throw error;
    }
  };
}

export default {
  name: 'onerror',
  initialize
};
