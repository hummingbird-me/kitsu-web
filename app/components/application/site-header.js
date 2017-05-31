import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';

export default Component.extend({
  authOpened: false,
  authComponent: 'social-auth',
  router: service('-routing'),

  isBrowseRoute: computed('router.currentRouteName', function() {
    const route = get(this, 'router.currentRouteName');
    const valids = ['anime', 'manga', 'trending', 'explore'];
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
