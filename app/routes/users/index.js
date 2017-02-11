import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Route.extend({
  i18n: service(),

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
    return get(this, 'i18n').t('titles.users.index', { user: name });
  }
});
