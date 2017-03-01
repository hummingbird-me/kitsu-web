import { Ability, computed as ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Ability.extend({
  postAbility: ability.ability('post', 'post'),
  commentAbility: ability.ability('comment', 'comment'),

  /**
   * Determine if the group member has enough permissions to view the admin dashboard
   */
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
    const membership = this._isGroupMember();
    if (!membership) { return false; }
    // If this is a restricted group, then posting is limited to leaders
    // @TODO(Groups): Move to constant
    const group = get(this, 'model');
    if (get(group, 'privacy') === 'restricted') {
      return get(membership, 'permissions').any(permission => (
        get(permission, 'permission') === 'owner' || get(permission, 'permission') === 'content'
      ));
    }
    return true;
  }).readOnly(),

  /**
   * Determines if the user can edit the post within the feed.
   * User = Admin, Owner, or has required group permissions
   */
  canEditPost: computed('model', 'membership', 'post', function() {
    const membership = this._isGroupMember();
    if (!membership) { return false; }
    const canEditPost = get(this, 'postAbility.canEdit');
    const hasPermissions = get(membership, 'permissions').any(permission => (
      get(permission, 'permission') === 'owner' || get(permission, 'permission') === 'content'
    ));
    return canEditPost || hasPermissions;
  }).readOnly(),

  /**
   * Determine if the user can write a comment on a group post.
   */
  canWriteComment: computed('model', 'membership', function() {
    return this._isGroupMember();
  }).readOnly(),

  /**
   * Determines if the user can edit the post within the feed.
   * User = Admin, Owner, or has required group permissions
   */
  canEditComment: computed('model', 'membership', 'comment', function() {
    const membership = this._isGroupMember();
    if (!membership) { return false; }
    const canEditComment = get(this, 'commentAbility.canEdit');
    const hasPermissions = get(membership, 'permissions').any(permission => (
      get(permission, 'permission') === 'owner' || get(permission, 'permission') === 'content'
    ));
    return canEditComment || hasPermissions;
  }).readOnly(),

  _isGroupMember() {
    const membership = get(this, 'membership');
    const user = get(this, 'session.hasUser') && get(this, 'session.account');
    return user && membership;
  }
});
