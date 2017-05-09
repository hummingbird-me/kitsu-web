import Route from 'ember-route';
import { isPresent } from 'ember-utils';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  queryParams: {
    category: { refreshModel: true, replace: true },
    sort: { refreshModel: true, replace: true },
    query: { refreshModel: true, replace: true }
  },

  model({ category, sort, query }) {
    return {
      taskInstance: this.queryPaginated('group', {
        filter: {
          category: category !== 'all' ? category : undefined,
          query: isPresent(query) ? query : undefined
        },
        fields: {
          groups: ['slug', 'name', 'avatar', 'tagline', 'membersCount', 'category'].join(',')
        },
        sort: isPresent(query) ? undefined : this._getRealSort(sort),
        include: 'category',
        page: { limit: 20 }
      }),
      paginatedRecords: []
    };
  },

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
