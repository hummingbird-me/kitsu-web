import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const { type } = this.paramsFor('explore.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    setProperties(controller, { type, mediaType });
  }
});
