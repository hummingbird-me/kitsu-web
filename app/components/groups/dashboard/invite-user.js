import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  store: service(),

  init() {
    this._super(...arguments);
    get(this, 'getInviteStatusTask').perform().then((record) => {
      if (record) {
        set(this, 'isInvited', true);
      }
    }).catch(() => {});
  },

  getInviteStatusTask: task(function* () {
    return yield get(this, 'store').query('group-invite', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'user.id')
      }
    }).then(records => get(records, 'firstObject'));
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
  })
});
