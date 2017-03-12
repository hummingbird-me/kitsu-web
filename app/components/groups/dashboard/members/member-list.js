import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  store: service(),
  members: concat('getMembersTask.last.value', 'paginatedRecords'),

  init() {
    this._super(...arguments);
    get(this, 'getMembersTask').perform();
  },

  getMembersTask: task(function* () {
    const group = get(this, 'group.id');
    return yield get(this, 'store').query('group-member', {
      filter: { query_group: group },
      include: 'user,permissions',
      page: { limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  })
});
