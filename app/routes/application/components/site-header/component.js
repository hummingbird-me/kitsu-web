import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  authOpened: false,
  authComponent: 'social-auth',
  session: service(),

  actions: {
    invalidateSession() {
      get(this, 'session').invalidate();
    }
  }
});
