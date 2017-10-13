import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get, observer } from '@ember/object';

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
