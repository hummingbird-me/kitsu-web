import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Route.extend({
  intl: service(),

  model() {
    return this.modelFor('groups.group.group-page');
  },

  titleToken(model) {
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.groups.group.group-page.index', { group: name });
  }
});
