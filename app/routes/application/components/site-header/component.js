import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Component.extend({
  authOpened: false,
  session: service(),

  actions: {
    invalidateSession() {
      get(this, 'session').invalidate();
    }
  }
});
