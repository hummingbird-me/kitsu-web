import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Route.extend(InfinitePagination, {
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'modelTask').perform(),
      paginatedElements: []
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
    return yield get(this, 'store').query('review', options).then((records) => {
      this.updatePageState(records);
      return records;
    });
  })
});
