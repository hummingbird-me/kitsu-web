import { Ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Ability.extend({
  /** Determine if the group member has enough permissions to view the admin dashboard */
  canViewDashboard: computed('model', function() {
    const hasPermissions = get(this, 'model') && (get(this, 'model.permissions.length') > 0);
    // content permission is for feed only, not dashboard
    if (hasPermissions && get(this, 'model.permissions.length') === 1) {
      return get(this, 'model.permissions.firstObject.permission') !== 'content';
    }
    return hasPermissions;
  }).readOnly(),

  /**
   * Determine if the user has the correct group permissions to create a post.
   */
  canWritePost: computed('model', 'membership', function() {
    const group = get(this, 'model');
    const membership = get(this, 'membership');
    const user = get(this, 'session.hasUser') && get(this, 'session.account');

    // If the user isn't authenticated or a member of the group, exit early
    if (!user || !membership) {
      return false;
    }

    // If this is a restricted group, then posting is limited to leaders
    // @TODO(Groups): Move to constant
    if (get(group, 'privacy') === 'restricted') {
      return get(membership, 'permissions').any(permission => (
        get(permission, 'permission') === 'owner' || get(permission, 'permission') === 'content'
      ));
    }
    return true;
  }).readOnly()
});
