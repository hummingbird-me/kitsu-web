import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task, timeout } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  intl: service(),
  notify: service(),
  store: service(),
  bans: concat('getBansTask.last.value', 'paginatedRecords'),

  init() {
    this._super(...arguments);
    get(this, 'getBansTask').perform();
  },

  canBan: computed('banUser', 'banUserTask.isIdle', function() {
    return get(this, 'banUser') && get(this, 'banUserTask.isIdle');
  }).readOnly(),

  getBansTask: task(function* () {
    return yield this.queryPaginated('group-ban', {
      filter: { group: get(this, 'group.id') },
      include: 'user'
    });
  }),

  searchUsersTask: task(function* (query) {
    yield timeout(250);
    return yield get(this, 'store').query('user', {
      filter: { query }
    });
  }).restartable(),

  banUserTask: task(function* () {
    const user = get(this, 'banUser');
    const ban = get(this, 'store').createRecord('group-ban', {
      group: get(this, 'group'),
      moderator: get(this, 'session.account'),
      user
    });
    yield ban.save().then(() => {
      set(this, 'banUser', null);
      get(this, 'paginatedRecords').addObject(ban);
    }).catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  })
});
