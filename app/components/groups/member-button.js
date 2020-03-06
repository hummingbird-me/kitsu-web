import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';
import { task, taskGroup } from 'ember-concurrency';

export default Component.extend({
  tagName: 'button',
  classNames: ['button', 'button--primary'],
  classNameBindings: ['isMemberOfGroup:inactive'],
  attributeBindings: ['groupTasks.isRunning:disabled', 'href'],
  memberRecord: null,

  intl: service(),
  notify: service(),
  store: service(),
  router: service(),
  queryCache: service(),
  isMemberOfGroup: bool('memberRecord'),
  groupTasks: taskGroup(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'session.hasUser')) { return; }
    if (get(this, 'membership') !== undefined) {
      this._updateMemberState(get(this, 'membership'));
    } else {
      get(this, 'getMemberStatusTask').perform().then(record => {
        this._updateMemberState(record);
      }).catch(() => {});
    }
  },

  click() {
    if (get(this, 'groupTasks.isRunning')) {
      return false;
    }

    // open sign up modal if unauthenticated
    if (!get(this, 'session.hasUser')) {
      get(this, 'session').signUpModal();
      return false;
    }

    // join or leave the group
    if (get(this, 'isMemberOfGroup')) {
      get(this, 'leaveGroupTask').perform().then(() => {
        this._updateMemberState(null);
        // If this is a closed group, it is not meant to be visible to users not in the group
        // so redirect the user who just left to the dashboard.
        if (get(this, 'group.isClosed')) {
          get(this, 'router').transitionTo('groups.index');
        }
      }).catch(() => {
        get(this, 'notify').error(get(this, 'intl').t('errors.request'));
        get(this, 'memberRecord').rollbackAttributes();
      });
    } else {
      get(this, 'joinGroupTask').perform().then(record => {
        this._updateMemberState(record);
      }).catch(() => {
        get(this, 'notify').error(get(this, 'intl').t('errors.request'));
      });
    }

    return false;
  },

  joinGroupTask: task(function* () {
    const record = get(this, 'store').createRecord('group-member', {
      group: get(this, 'group'),
      user: get(this, 'session.account')
    });
    return yield record.save();
  }).group('groupTasks'),

  leaveGroupTask: task(function* () {
    return yield get(this, 'memberRecord').destroyRecord().then(() => {
      get(this, 'queryCache').invalidateQuery('group-member', this._getRequestOptions());
    });
  }).group('groupTasks'),

  getMemberStatusTask: task(function* () {
    return yield get(this, 'queryCache').query('group-member', this._getRequestOptions())
      .then(records => get(records, 'firstObject'));
  }).group('groupTasks'),

  _updateMemberState(value) {
    if (get(this, 'isDestroyed')) { return; }
    set(this, 'memberRecord', value);
  },

  _getRequestOptions() {
    return {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'session.account.id')
      }
    };
  }
});
