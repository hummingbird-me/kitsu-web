import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  intl: service(),

  modelTask: task(function* (user) {
    return yield get(this, 'store').query('follow', {
      filter: { follower: get(user, 'id') },
      include: 'followed',
      sort: '-created_at'
    });
  }),

  model() {
    const user = this.modelFor('users');
    return { taskInstance: get(this, 'modelTask').perform(user) };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.following', { user: name });
  }
});
