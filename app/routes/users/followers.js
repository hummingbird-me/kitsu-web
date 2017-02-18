import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
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

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.followers', { user: name });
  },

  modelTask: task(function* () {
    const user = this.modelFor('users');
    const options = {
      filter: { followed: get(user, 'id') },
      include: 'follower',
      sort: '-created_at'
    };
    return yield get(this, 'store').query('follow', options).then((records) => {
      this.updatePageState(records);
      return records;
    });
  })
});
