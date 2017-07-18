import { Ability, computed as ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

const hasPermission = permission => (
  computed('membership.permissions.@each.hasDirtyAttributes', function() {
    return this._isGroupMember() && get(this, 'membership').hasPermission(permission);
  }).readOnly()
);

export default Ability.extend({
  postAbility: ability.ability('post', 'post'),
  commentAbility: ability.ability('comment', 'comment'),

  canViewDashboard: computed('membership', function() {
    const isMember = this._isGroupMember();
    return isMember && (get(get(this, 'membership'), 'permissions.length') > 0);
  }).readOnly(),

  canManageEverything: hasPermission('owner'),
  canManageMembers: hasPermission('members'),
  canManageLeaders: hasPermission('leaders'),
  canManageSettings: hasPermission('community'),
  canManageReports: hasPermission('content'),
  canManageTickets: hasPermission('tickets'),

  canWritePost: computed('model', 'membership', function() {
    // If this is a restricted group, then posting is limited to leaders
    const group = get(this, 'model');
    if (get(group, 'isRestricted')) {
      const membership = this._isGroupMember();
      return membership && membership.hasPermission('content');
    }
    return true;
  }).readOnly(),

  canEditPost: computed('model', 'membership', 'post', function() {
    // If you're the owner of the content, or a site-admin then the post is editable
    const canEditPost = get(this, 'postAbility.canEdit');
    if (canEditPost) { return true; }

    // Do you have the correct group permissions to edit community content?
    const membership = this._isGroupMember();
    return membership && membership.hasPermission('content');
  }).readOnly(),

  canEditComment: computed('model', 'membership', 'comment', function() {
    // If you're the owner of the comment, or a site admin then you can edit
    const canEditComment = get(this, 'commentAbility.canEdit');
    if (canEditComment) { return true; }

    // Requires the correct permissions
    const membership = this._isGroupMember();
    return membership && membership.hasPermission('content');
  }).readOnly(),

  /**
   * Checks if the user is authenticated and that they are a group member.
   *
   * @returns {Boolean}
   */
  _isGroupMember() {
    const membership = get(this, 'membership');
    const user = get(this, 'session.hasUser') && get(this, 'session.account');
    return user && membership;
  }
});
