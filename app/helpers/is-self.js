import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

export function isSelf(session, user) {
  return session === user;
}

export default Helper.extend({
  session: service(),

  compute([user]) {
    return isSelf(get(this, 'session.account.id'), get(user, 'id'));
  },

  didAuthenticate: observer('session.account', function() {
    this.recompute();
  })
});
