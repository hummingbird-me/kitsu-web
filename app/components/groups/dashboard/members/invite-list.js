import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import errorMessages from 'client/utils/error-messages';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  notify: service(),
  store: service(),
  invites: concat('getInvitesTask.last.value', 'paginatedRecords'),

  init() {
    this._super(...arguments);
    get(this, 'getInvitesTask').perform();
  },

  canInvite: computed('inviteUser', 'inviteUserTask.isIdle', function() {
    return get(this, 'inviteUser') && get(this, 'inviteUserTask.isIdle');
  }).readOnly(),

  getInvitesTask: task(function* () {
    return yield this.queryPaginated('group-invite', {
      filter: { group: get(this, 'group.id'), status: 'pending' },
      include: 'user'
    });
  }),

  searchUsersTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('user', {
      filter: { query }
    });
  }).restartable(),

  inviteUserTask: task(function* () {
    const user = get(this, 'inviteUser');
    const invite = get(this, 'store').createRecord('group-invite', {
      group: get(this, 'group'),
      sender: get(this, 'session.account'),
      user
    });
    yield invite.save().then(() => {
      set(this, 'inviteUser', null);
      get(this, 'paginatedRecords').addObject(invite);
    }).catch((error) => {
      get(this, 'notify').error(errorMessages(error));
    });
  })
});
