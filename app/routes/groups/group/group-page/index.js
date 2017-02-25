import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  model() {
    return this.modelFor('groups.group.group-page');
  },

  titleToken(model) {
    return get(model, 'name');
  }
});
