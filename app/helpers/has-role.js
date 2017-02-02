import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

export default Helper.extend({
  session: service(),

  compute([role, resource]) {
    return get(this, 'session.hasUser') && get(this, 'session.account').hasRole(role, resource);
  },

  _didAuthenticate: observer('session.hasUser', function() {
    this.recompute();
  })
});
