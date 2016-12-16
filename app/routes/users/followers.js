import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  i18n: service(),

  modelTask: task(function* (user) {
    return yield get(this, 'store').query('follow', {
      filter: { followed: get(user, 'id') },
      include: 'follower',
      sort: '-created_at'
    });
  }).restartable(),

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
    return get(this, 'i18n').t('titles.users.followers', { user: name });
  }
});
