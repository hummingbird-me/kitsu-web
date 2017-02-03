import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

export function isSelf(self, other) {
  return get(self, 'id') === get(other, 'id');
}

export default Helper.extend({
  session: service(),

  compute([user]) {
    const self = get(this, 'session.account');
    if (!self || !user) { return false; }
    return isSelf(self, user);
  },

  _didAuthenticate: observer('session.account', function() {
    this.recompute();
  })
});
