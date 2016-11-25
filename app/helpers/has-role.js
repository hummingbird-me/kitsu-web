import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import observer from 'ember-metal/observer';

/**
 * Determines if the sessioned user has the specified role.
 *
 * `(has-role "role" <resource>)`
 */
export default Helper.extend({
  session: service(),

  compute([role, resource]) {
    return get(this, 'session.hasUser') && get(this, 'session.account').hasRole(role, resource);
  },

  didAuthenticate: observer('session.account', function() {
    this.recompute();
  }),

  didGetRoles: observer('session.account.userRoles.@each.role', function() {
    this.recompute();
  })
});
