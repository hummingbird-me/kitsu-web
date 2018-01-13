import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return this.get('store').query('stat', {
      filter: { userId: get(user, 'id') }
    });
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const user = this.modelFor('users');
    const name = get(user, 'name');
    return get(this, 'intl').t('titles.users.stats', { user: name });
  }
});
