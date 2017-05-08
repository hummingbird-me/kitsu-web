import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'modelTask').perform(),
      paginatedRecords: []
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
      fields: { users: ['avatar', 'coverImage', 'name'].join(',') },
      include: 'follower',
      sort: '-created_at',
      page: { limit: 20 }
    };
    return yield this.queryPaginated('follow', options);
  })
});
