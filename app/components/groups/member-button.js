import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { bool } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  router: service('-routing'),
  tagName: 'button',
  classNames: ['button', 'button--primary'],
  classNameBindings: ['isMemberOfGroup:inactive'],
  attributeBindings: ['getMemberStatusTask.isRunning:disabled'],
  memberRecord: null,
  isMemberOfGroup: bool('memberRecord'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'session.hasUser')) { return; }
    this._updateMemberState(get(this, 'membership'));
  },

  click() {
    // open sign up modal if unauthenticated
    if (!get(this, 'session.hasUser')) {
      get(this, 'session').signUpModal();
    }

    // join or leave the group
    if (get(this, 'isMemberOfGroup')) {
      get(this, 'leaveGroupTask').perform().then(() => {
        this._updateMemberState(null);
        // If this is a closed group, it is not meant to be visible to users not in the group
        // so redirect the user who just left to the dashboard.
        if (get(this, 'group.isClosed')) {
          get(this, 'router').transitionTo('dashboard');
        }
      }).catch(() => {
        get(this, 'memberRecord').rollbackAttributes();
      });
    } else {
      get(this, 'joinGroupTask').perform().then((record) => {
        this._updateMemberState(record);
      }).catch(() => {});
    }
  },

  joinGroupTask: task(function* () {
    const record = get(this, 'store').createRecord('group-member', {
      group: get(this, 'group'),
      user: get(this, 'session.account')
    });
    return yield record.save();
  }),

  leaveGroupTask: task(function* () {
    return yield get(this, 'memberRecord').destroyRecord();
  }),

  _updateMemberState(value) {
    if (get(this, 'isDestroyed')) { return; }
    set(this, 'memberRecord', value);
  }
});
