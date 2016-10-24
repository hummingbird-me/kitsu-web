import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export function isSelf(session, user) {
  return session === user;
}

export default Helper.extend({
  session: service(),

  compute([user]) {
    return isSelf(get(this, 'session.account.id'), get(user, 'id'));
  }
});
