import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const mediaType = this.paramsFor('explore').media_type;
    const categoryName = this.paramsFor('explore.category').name;
    setProperties(controller, { mediaType, categoryName });
  }
});
