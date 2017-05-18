import Route from 'ember-route';
import set from 'ember-metal/set';

export default Route.extend({
  model(params) {
    return params.type;
  },

  setupController(controller, model) {
    this._super(...arguments);
    set(controller, 'mediaType', model);
  }
});
