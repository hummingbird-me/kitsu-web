import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  beforeModel() {
    const { media } = this.paramsFor(get(this, 'routeName'));
    if (!['anime', 'manga'].includes(media)) {
      this.replaceWith({ queryParams: { media: 'anime' } });
    }
  },

  model({ media, sort }) {
    const user = this.modelFor('users');
    return {
      reactionsTaskInstance: this.queryPaginated('media-reaction', {
        include: `user,${media},libraryEntry`,
        filter: {
          user_id: get(user, 'id'),
          media_type: capitalize(media)
        },
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

  _getSortingKey(sort) {
    switch (sort) {
      case 'popular':
        return '-upVotesCount';
      default:
        return '-createdAt';
    }
  }
});
