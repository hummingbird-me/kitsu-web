import Route from 'ember-route';
import { isPresent } from 'ember-utils';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  model(params) {
    return {
      taskInstance: this.queryPaginated('group', this._getRequestOptions(params)),
      paginatedRecords: []
    };
  },

  headTags() {
    const description = `Looking for a place to discuss a topic or activity?
      Check out Groups on Kitsu.`;
    return [{
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: description
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: description
      }
    }];
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  },

  _getRequestOptions({ category, sort, query }) {
    return {
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
