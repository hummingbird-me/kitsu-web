import Route from 'ember-route';
import set from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const mediaType = this.paramsFor('explore').type;
    set(controller, 'mediaType', mediaType);
  }
});
