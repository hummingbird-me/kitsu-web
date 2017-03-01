import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Route.extend({
  intl: service(),

  model() {
    return this.modelFor('groups.group.dashboard');
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.leaders', { group });
  }
});
