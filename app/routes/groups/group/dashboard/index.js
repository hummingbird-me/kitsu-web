import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  model() {
    return this.modelFor('groups.group.dashboard');
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.index', { group });
  }
});
