import Route from 'ember-route';
import get from 'ember-metal/get';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  queryParams: {
    category: { refreshModel: true, replace: true },
    sort: { refreshModel: true, replace: true },
    query: { refreshModel: true, replace: true }
  },

  model(params) {
    return {
      taskInstance: get(this, 'getGroupsTask').perform(params),
      paginatedRecords: []
    };
  },

  getGroupsTask: task(function* ({ category, sort, query }) {
    const options = {
      filter: {
        category: category !== 'all' ? category : undefined,
        query: isPresent(query) ? query : undefined
      },
      sort: isPresent(query) ? undefined : this._getRealSort(sort),
      include: 'category'
    };
    return yield get(this, 'store').query('group', options).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }).restartable(),

  _getRealSort(sort) {
    switch (sort) {
      case 'newest':
        return '-created_at';
      case 'oldest':
        return 'created_at';
      default:
        return '-last_activity_at';
    }
  }
});
