import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const moreType = this.paramsFor('explore.more').name;
    const mediaType = this.paramsFor('explore').type;
    setProperties(controller, { moreType, mediaType });
  }
});
