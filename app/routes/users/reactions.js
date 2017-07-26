import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  beforeModel() {
    const { filter } = this.paramsFor(get(this, 'routeName'));
    if (!['all', 'anime', 'manga'].includes(filter)) {
      this.replaceWith({ queryParams: { filter: 'all' } });
    }
  },

  model({ filter, sort }) {
    const mediaInclude = filter === 'all' ? 'anime,manga' : filter;
    return {
      reactionsTaskInstance: this.queryPaginated('media-reaction', {
        include: `user,${mediaInclude},libraryEntry`,
        filter: this._getFilter(filter),
        sort: this._getSortingKey(sort)
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.reactions', { user: name });
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  },

  _getFilter(filter) {
    const user = this.modelFor('users');
    const reactionFilter = { user_id: get(user, 'id') };
    if (filter !== 'all') {
      reactionFilter.media_type = capitalize(filter);
    }
    return reactionFilter;
  },

  _getSortingKey(sort) {
    switch (sort) {
      case 'best':
        return '-upVotesCount';
      default:
        return '-createdAt';
    }
  }
});
