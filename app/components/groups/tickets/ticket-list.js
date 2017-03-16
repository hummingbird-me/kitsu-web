import Component from 'ember-component';
import get from 'ember-metal/get';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  filterOptions: ['open', 'resolved', 'all'],
  tickets: concat('getTicketsTask.last.value', 'paginatedRecords', 'addedTickets'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getTicketsTask').perform();
  },

  getTicketsTask: task(function* () {
    const query = get(this, 'query');
    return yield this.queryPaginated('group-ticket', {
      filter: {
        group: get(this, 'group.id'),
        query: isPresent(query) ? query : undefined,
        user: get(this, 'peronsalTickets') ? get(this, 'session.account.id') : undefined,
        status: this._getRealStatus()
      },
      include: 'user,firstMessage',
      sort: isPresent(query) ? undefined : '-created_at'
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
