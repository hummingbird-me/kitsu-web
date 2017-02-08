import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  authOpened: false,
  authComponent: 'social-auth',
  router: service('-routing'),

  actions: {
    invalidateSession() {
      get(this, 'session').invalidate();
    },

    transitionToDashboard() {
      const currentRouteName = get(this, 'router.currentRouteName');
      if (currentRouteName === 'dashboard') {
        window.location.reload();
      } else {
        get(this, 'router').transitionTo('dashboard');
      }
    }
  }
});
