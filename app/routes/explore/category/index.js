import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const mediaType = this.paramsFor('explore').media_type;
    const category = this.modelFor('explore.category');
    setProperties(controller, { mediaType, category });
  }
});
