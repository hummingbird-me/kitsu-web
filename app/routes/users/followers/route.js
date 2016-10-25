import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  i18n: service(),

  model() {
    const user = this.modelFor('users');
    return get(this, 'store').query('follow', {
      filter: {
        followed: get(user, 'id')
      },
      include: 'follower'
    });
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
