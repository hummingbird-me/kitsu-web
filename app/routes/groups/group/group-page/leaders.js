import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Route.extend({
  queryParams: {
    filter: { replace: true },
    query: { replace: true }
  },
  intl: service(),

  model() {
    return this.modelFor('groups.group.group-page');
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, '_addedTickets', []);
  },

  titleToken() {
    const model = this.modelFor('groups.group.group-page');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.group-page.leaders', { group });
  },
});
