import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task, timeout } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  isManaging: true,
  intl: service(),
  notify: service(),
  store: service(),
  leaders: concat('getLeadersTask.last.value', 'paginatedRecords'),

  canAdd: computed('userToAdd', 'findGroupMemberTask.isIdle', function() {
    return get(this, 'userToAdd') && get(this, 'findGroupMemberTask.isIdle');
  }).readOnly(),

  init() {
    this._super(...arguments);
    get(this, 'getLeadersTask').perform();
  },

  getLeadersTask: task(function* () {
    return yield this.queryPaginated('group-member', {
      filter: {
        query_group: get(this, 'group.id'),
        query_rank: 'admin,mod'
      },
      include: 'user,permissions',
      sort: '-rank'
    });
  }),

  searchUsersTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('group-member', {
      filter: { query, query_group: get(this, 'group.id') },
      include: 'user'
    }).then(records => records.map(record => get(record, 'user')));
  }).restartable(),

  findGroupMemberTask: task(function* () {
    const username = get(this, 'userToAdd.name');
    const member = yield get(this, 'store').query('group-member', {
      filter: { query: username },
      include: 'user,permissions',
      page: { limit: 1 }
    }).then(records => get(records, 'firstObject'));
    if (member) {
      set(this, 'foundMember', member);
      set(this, 'permissionsModal', true);
    } else {
      get(this, 'notify').error(get(this, 'intl').t('groups.leaders.list.not-found'));
    }
  }),

  actions: {
    addNewMember(member) {
      set(member, 'rank', 'mod');
      get(this, 'paginatedRecords').addObject(member);
    },

    openTicketModal() {
      if (!get(this, 'session.hasUser')) {
        get(this, 'session').signUpModal();
        return;
      }
      const ticket = get(this, 'store').createRecord('group-ticket', {
        group: get(this, 'group'),
        user: get(this, 'session.account')
      });
      set(this, 'newTicket', ticket);
      set(this, 'ticketModal', true);
    }
  }
});
