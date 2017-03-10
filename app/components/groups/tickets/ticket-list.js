import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  filterOptions: ['open', 'resolved', 'all'],
  store: service(),
  tickets: concat('getTicketsTask.last.value', 'paginatedRecords', 'addedTickets'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getTicketsTask').perform();
  },

  getTicketsTask: task(function* () {
    const query = get(this, 'query');
    return yield get(this, 'store').query('group-ticket', {
      filter: {
        query_group: get(this, 'group.id'),
        query: isPresent(query) ? query : undefined,
        user: get(this, 'peronsalTickets') ? get(this, 'session.account.id') : undefined,
        status: this._getRealStatus()
      },
      include: 'user,messages.user',
      sort: '-created_at'
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
