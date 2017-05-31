import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const { type } = this.paramsFor('explore.category.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    const category = this.modelFor('explore.category');
    setProperties(controller, { type, mediaType, category });
  }
});
