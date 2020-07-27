import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import errorMessages from 'client/utils/error-messages';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  algolia: service(),
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
    const index = yield this.get('algolia.getIndex').perform('users');
    const response = yield index.search(query, {
      attributesToRetrieve: ['id', 'name'],
      attributesToHighlight: [],
      hitsPerPage: 10,
      responseFields: ['hits', 'hitsPerPage', 'nbHits', 'nbPages', 'offset', 'page']
    });
    return response.hits || [];
  }).restartable(),

  inviteUserTask: task(function* () {
    const invitee = get(this, 'inviteUser');
    const user = yield get(this, 'store').findRecord('user', get(invitee, 'id'));
    const invite = get(this, 'store').createRecord('group-invite', {
      group: get(this, 'group'),
      sender: get(this, 'session.account'),
      user
    });
    yield invite.save().then(() => {
      set(this, 'inviteUser', null);
      get(this, 'paginatedRecords').addObject(invite);
    }).catch(error => {
      get(this, 'notify').error(errorMessages(error));
    });
  })
});
