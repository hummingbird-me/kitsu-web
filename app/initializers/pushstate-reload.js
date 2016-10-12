import Ember from 'ember';
import { later } from 'ember-runloop';

/**
 * `SecurityError: DOM Exception 18` is thrown by Safari (iOS/OSX) when
 * pushState is used >= 100 times within 30 seconds. This will reload browsers
 * that hit this limit, where it'll break some functionality with our app.
 */
export function initialize() {
  Ember.onerror = function(error) {
    if (error.name === 'SecurityError' && error.code === 18) {
      later(() => window.location.reload());
    }
  };
}

export default {
  name: 'pushstate-reload',
  initialize
};
