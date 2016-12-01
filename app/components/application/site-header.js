import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import Config from 'client/config/environment';
import getter from 'client/utils/getter';

export default Component.extend({
  authOpened: false,
  authComponent: 'social-auth',
  session: service(),
  isStaging: getter(() => Config.isStaging),

  actions: {
    invalidateSession() {
      get(this, 'session').invalidate();
    }
  }
});
