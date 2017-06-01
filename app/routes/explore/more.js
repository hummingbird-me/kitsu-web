import Route from 'ember-route';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';

export default Route.extend({
  intl: service(),

  model() {
    return this.modelFor('explore');
  },

  setupController(controller) {
    this._super(...arguments);
    const { type } = this.paramsFor('explore.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    setProperties(controller, { type, mediaType });
  },

  titleToken() {
    const { type } = this.paramsFor('explore.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    const title = get(this, 'intl').t(`titles.explore.more.${type}`, {
      type: capitalize(mediaType)
    });
    set(this, 'breadcrumb', title);
    return title;
  }
});
