import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

export function canMutate(session, user, resource) {
  const isOwner = session.isCurrentUser(user);
  if (!resource) { return isOwner; }
  const isStaff = get(session, 'hasUser') && get(session, 'account').hasRole('admin', resource);
  return isOwner || isStaff;
}

export default Helper.extend({
  session: service(),

  compute([user, resource]) {
    return canMutate(get(this, 'session'), user, resource);
  },

  _didAuthenticate: observer('session.hasUser', function() {
    this.recompute();
  })
});
