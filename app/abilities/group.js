import { Ability, computed as ability } from 'ember-can';
import get from 'ember-metal/get';
import computed from 'ember-computed';

const hasPermission = permission => (
  computed('membership', function() {
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

  canManageMembers: hasPermission('members'),
  canManageLeaders: hasPermission('leaders'),
  canManageSettings: hasPermission('community'),
  canManageReports: hasPermission('content'),
  canManageTickets: hasPermission('tickets'),

  canWritePost: computed('model', 'membership', function() {
    // can only write a post if you're a group member'
    const membership = this._isGroupMember();
    if (!membership) { return false; }

    // If this is a restricted group, then posting is limited to leaders
    const group = get(this, 'model');
    if (get(group, 'isRestricted')) {
      return membership.hasPermission('content');
    }
    return true;
  }).readOnly(),

  canEditPost: computed('model', 'membership', 'post', function() {
    // If you're the owner of the content, or a site-admin then the post is editable
    const canEditPost = get(this, 'postAbility.canEdit');
    if (canEditPost) { return true; }

    // If you're not a group member then you can't edit a group post
    const membership = this._isGroupMember();
    if (!membership) { return false; }

    // Do you have the correct group permissions to edit community content?
    return membership.hasPermission('content');
  }).readOnly(),

  canWriteComment: computed('model', 'membership', function() {
    return this._isGroupMember();
  }).readOnly(),

  canEditComment: computed('model', 'membership', 'comment', function() {
    // If you're the owner of the comment, or a site admin then you can edit
    const canEditComment = get(this, 'commentAbility.canEdit');
    if (canEditComment) { return true; }

    // You have to be a group member
    const membership = this._isGroupMember();
    if (!membership) { return false; }

    // Requires the correct permissions
    return membership.hasPermission('content');
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
