import MediaIndexRoute from 'client/routes/media/index';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default MediaIndexRoute.extend({
  queryCache: service(),

  beforeModel() {
    this._super(...arguments);
    const controller = this.controllerFor(get(this, 'routeName'));
    if (get(controller, 'availableStreamers') !== undefined) {
      return;
    }
    get(this, 'queryCache').query('streamer', {
      page: { limit: 10000, offset: 0 }
    }).then(streamers => set(controller, 'availableStreamers', streamers));
  },

  _buildFilters() {
    const filters = this._super(...arguments);
    const { year, season } = filters.filter;
    if (!year || !season) { return filters; }
    const [lower, upper] = year.split('..');
    if (parseInt(lower, 10) === parseInt(upper, 10)) {
      delete filters.filter.year;
      filters.filter.season_year = lower;
    }
    return filters;
  },

  _getFieldsets() {
    const fields = this._super(...arguments);
    fields.anime = `${fields.anime},youtubeVideoId`;
    return fields;
  }
});
