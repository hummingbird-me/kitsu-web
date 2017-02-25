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
  }).readOnly()
});
