import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  i18n: service(),

  modelTask: task(function* (user) {
    return yield get(this, 'store').query('review', {
      include: 'user,media',
      filter: {
        user_id: get(user, 'id')
      }
    });
  }).restartable(),

  model() {
    const user = this.modelFor('users');
    return { taskInstance: get(this, 'modelTask').perform(user) };
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'i18n').t('titles.users.reviews', { user: name });
  }
});
