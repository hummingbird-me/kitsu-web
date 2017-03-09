import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  filterOptions: ['open', 'resolved', 'all'],
  store: service(),
  tickets: concat('getTicketsTask.last.value', 'paginatedRecords'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getTicketsTask').perform();
  },

  getTicketsTask: task(function* () {
    return yield get(this, 'store').query('group-ticket', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'peronsalTickets') ? get(this, 'session.account.id') : undefined,
        status: this._getRealStatus()
      },
      include: 'user,messages.user',
      sort: '-created_at',
      page: { limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  _getRealStatus() {
    const filter = get(this, 'filter');
    switch (filter) {
      case 'open':
        return 'created';
      case 'resolved':
        return 'resolved';
      default:
        return undefined;
    }
  }
});
