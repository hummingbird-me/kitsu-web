import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'modelTask').perform(),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.reviews', { user: name });
  },

  modelTask: task(function* () {
    const user = this.modelFor('users');
    const options = {
      include: 'user,media',
      filter: {
        user_id: get(user, 'id')
      }
    };
    return yield this.queryPaginated('review', options);
  })
});
