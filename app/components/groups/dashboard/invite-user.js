import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Component.extend({
  tagName: '',
  store: service(),

  init() {
    this._super(...arguments);
    get(this, 'getUserState').perform().then(([invite, member]) => {
      if (invite || member) {
        set(this, 'isInvited', true);
      }
    }).catch(() => {});
  },

  /**
   * Determines if the user is already invited or already a group member
   */
  getUserState: task(function* () {
    return yield RSVP.all([
      get(this, '_getInviteStatusTask').perform(),
      get(this, '_getMemberStatusTask').perform()
    ]);
  }),

  inviteMemberTask: task(function* (user) {
    const invite = get(this, 'store').createRecord('group-invite', {
      group: get(this, 'group'),
      sender: get(this, 'session.account'),
      user
    });
    yield invite.save().then(() => {
      set(this, 'isInvited', true);
    });
  }),

  _getInviteStatusTask: task(function* () {
    return yield get(this, 'store').query('group-invite', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'user.id')
      }
    }).then(records => get(records, 'firstObject'));
  }),

  _getMemberStatusTask: task(function* () {
    return yield get(this, 'store').query('group-member', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'user.id')
      }
    }).then(records => get(records, 'firstObject'));
  })
});
