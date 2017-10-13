import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  authOpened: false,
  authComponent: 'social-auth',
  router: service('-routing'),

  isBrowseRoute: computed('router.currentRouteName', function() {
    const route = get(this, 'router.currentRouteName');
    const valids = ['anime', 'manga', 'explore'];
    return valids.includes((route || '').split('.')[0]);
  }).readOnly(),

  isFeedbackRoute: computed('router.currentRouteName', function() {
    const route = get(this, 'router.currentRouteName');
    return (route || '').split('.')[0] === 'feedback';
  }).readOnly(),

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
