import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  queryParams: {
    category: { refreshModel: true, replace: true },
    sort: { refreshModel: true, replace: true },
    query: { refreshModel: true, replace: true }
  },
  intl: service(),

  model({ category, sort, query }) {
    const user = this.modelFor('users');
    return {
      taskInstance: this.queryPaginated('group-member', {
        filter: {
          query_user: get(user, 'id'),
          group_name: isPresent(query) ? query : undefined,
          group_category: category !== 'all' ? category : undefined,
        },
        fields: {
          groups: ['slug', 'name', 'avatar', 'tagline', 'membersCount', 'category'].join(',')
        },
        sort: isPresent(query) ? undefined : this._getRealSort(sort),
        include: 'group.category',
        page: { limit: 20 }
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.groups', { user: name });
  },

  _getRealSort(sort) {
    switch (sort) {
      case 'oldest':
        return 'created_at';
      default:
        return '-created_at';
    }
  }
});
