import MediaIndexRoute from 'client/routes/media/index';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';

export default MediaIndexRoute.extend({
  queryParams: {
    ageRating: { refreshModel: true, replace: true },
    episodeCount: { refreshModel: true, replace: true },
    streamers: { refreshModel: true, replace: true },
    season: { refreshModel: true, replace: true }
  },

  beforeModel() {
    this._super(...arguments);
    const controller = this.controllerFor(get(this, 'routeName'));
    if (get(controller, 'availableStreamers') !== undefined) {
      return;
    }
    get(this, 'store').query('streamer', {
      page: { limit: 10000, offset: 0 }
    }).then(streamers => set(controller, 'availableStreamers', streamers));
  },

  serializeQueryParam(value, key) {
    let result = this._super(...arguments);
    if (key === 'episodeCount') {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (upper === 100) {
          result = `${lower}..`;
        }
      }
    }
    return result;
  },

  deserializeQueryParam(value, key) {
    let result = this._super(...arguments);
    if (key === 'episodeCount') {
      if (value !== undefined) {
        const [lower, upper] = result;
        if (isEmpty(upper)) {
          result = [lower, 100];
        }
      }
    }
    return result;
  },
});
