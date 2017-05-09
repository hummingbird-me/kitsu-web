import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return {
      taskInstance: this.queryPaginated('review', {
        include: 'user,media',
        filter: {
          user_id: get(user, 'id')
        }
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.reviews', { user: name });
  }
});
