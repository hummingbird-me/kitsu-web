import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';
import { equal } from 'ember-computed';

export default Base.extend({
  createdAt: attr('utc'),
  rank: attr('string'),

  group: belongsTo('group'),
  user: belongsTo('user'),

  permissions: hasMany('group-permission', { inverse: 'groupMember' }),

  isOwner: equal('rank', 'admin'),
  isMod: equal('rank', 'mod'),

  /**
   * Checks to see if the group member has a specific permission.
   *
   * @param {String} permission
   * @returns {Boolean}
   */
  hasPermission(permission) {
    // Owner of the group has all permissions
    if (get(this, 'isOwner')) { return true; }

    const permissions = this.hasMany('permissions').value();
    if (permissions) {
      return permissions.any(perm => get(perm, 'permission') === permission);
    }
    return false;
  }
});
