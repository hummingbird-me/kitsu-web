import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Route.extend({
  intl: service(),

  setupController(controller) {
    this._super(...arguments);
    const { media_type: mediaType } = this.paramsFor('explore');
    set(controller, 'mediaType', mediaType);
  },

  titleToken() {
    const { media_type: mediaType } = this.paramsFor('explore');
    return get(this, 'intl').t('titles.explore.index', { mediaType });
  }
});
