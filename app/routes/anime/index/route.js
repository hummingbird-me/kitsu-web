import MediaIndexRoute from 'client/routes/media/index/route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default MediaIndexRoute.extend({
  queryParams: {
    ageRating: { refreshModel: true, replace: true },
    episodeCount: { refreshModel: true, replace: true },
    streamers: { refreshModel: true, replace: true }
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
  }
});
