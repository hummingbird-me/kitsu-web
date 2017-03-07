import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  queryParams: {
    category: { refreshModel: true, replace: true },
    sort: { refreshModel: true, replace: true },
  },

  model(params) {
    return {
      taskInstance: get(this, 'getGroupsTask').perform(params),
      paginatedRecords: []
    };
  },

  getGroupsTask: task(function* ({ category, sort }) {
    const options = {
      filters: { category },
      sort: this._getRealSort(sort),
      include: 'category'
    };
    return yield get(this, 'store').query('group', options);
  }).restartable(),

  _getRealSort(sort) {
    switch (sort) {
      case 'newest':
        return '-created_at';
      case 'oldest':
        return 'created_at';
      default:
        return '';
    }
  }
});
