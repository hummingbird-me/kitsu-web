import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  modelTask: task(function* (user) {
    const results = yield get(this, 'store').query('review', {
      include: 'user,media',
      filter: {
        user_id: get(user, 'id')
      }
    });
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
  }),

  model() {
    const user = this.modelFor('users');
    return { taskInstance: get(this, 'modelTask').perform(user) };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.reviews', { user: name });
  }
});
