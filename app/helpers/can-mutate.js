import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

/**
 * Determines whether the user can mutate an object, by either being the content owner,
 * an admin, or an admin/moderator for the specific resource.
 *
 * `(can-mutate <user> <resource>)`
 */
export default Helper.extend({
  session: service(),

  compute([user, model]) {
    const isOwner = get(this, 'session').isCurrentUser(user);
    if (model === undefined) {
      return isOwner;
    }
    const isAdmin = get(this, 'session.hasUser') && get(this, 'session.account').hasRole('admin', model);
    return isOwner || isAdmin;
  },

  didAuthenticate: observer('session.account', function() {
    this.recompute();
  }),

  didGetRoles: observer('session.account.userRoles.@each.role', function() {
    this.recompute();
  })
});
