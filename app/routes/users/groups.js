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
    const user = this.modelFor('users');
    const options = {
      filter: {
        user: get(user, 'id'),
        group: {
          category: category !== 'all' ? category : undefined,
        }
      },
      sort: this._getRealSort(sort),
      include: 'group.category'
    };
    return yield get(this, 'store').query('group-member', options).then((records) => {
      this.updatePageState(records);
      return records.map(record => get(record, 'group'));
    });
  }).restartable(),

  _getRealSort(sort) {
    switch (sort) {
      case 'newest':
        return '-created_at';
      case 'oldest':
        return 'created_at';
      default:
        return '-group.last_activity_at';
    }
  }
});
