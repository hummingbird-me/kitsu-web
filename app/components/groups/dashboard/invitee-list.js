import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  intl: service(),
  notify: service(),
  invitees: concat('getInvitesTask.last.value', 'paginatedRecords'),

  init() {
    this._super(...arguments);
    get(this, 'getInvitesTask').perform();
  },

  getInvitesTask: task(function* () {
    const group = get(this, 'group.id');
    return yield get(this, 'store').query('group-invite', {
      filter: { group, status: 'pending' },
      include: 'user,sender',
      page: { limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  removeInviteTask: task(function* (invitee) {
    yield invitee.destroyRecord().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  })
});
