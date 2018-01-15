import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';

export default Route.extend({
  intl: service(),

  async model() {
    const user = this.modelFor('users');
    const stats = await this.get('store').query('stat', {
      filter: { userId: get(user, 'id') }
    });
    return stats.reduce((acc, stat) => {
      const camelKind = camelize(get(stat, 'kind'));
      return { ...acc, [camelKind]: stat };
    }, {});
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
