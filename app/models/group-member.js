import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';

export default Base.extend({
  createdAt: attr('utc'),
  rank: attr('string'),
  unreadCount: attr('number'),
  hidden: attr('boolean'),

  group: belongsTo('group', { inverse: 'members' }),
  user: belongsTo('user'),

  permissions: hasMany('group-permission', { inverse: 'groupMember' }),

  /**
   * Checks to see if the group member has a specific permission.
   *
   * @param {String} permission
   * @returns {Boolean}
   */
  hasPermission(permission) {
    const permissions = this.hasMany('permissions').value();
    if (permissions) {
      const record = permissions.find(perm => (
        get(perm, 'permission') === 'owner' || get(perm, 'permission') === permission
      ));
      return record ? !get(record, 'hasDirtyAttributes') : false;
    }
    return false;
  }
});
