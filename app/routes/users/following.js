import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  modelTask: task(function* (user) {
    const results = yield get(this, 'store').query('follow', {
      filter: { follower: get(user, 'id') },
      include: 'followed',
      sort: '-created_at'
    });
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
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
