import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  model() {
    const user = this.modelFor('users');
    return get(user, 'pinnedPost');
  },

  setupController(controller) {
    this._super(...arguments);
    const model = this.modelFor('users');
    set(this, 'breadcrumb', get(model, 'name'));
    set(controller, 'user', model);
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.index', { user: name });
  }
});
