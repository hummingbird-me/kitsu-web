import MediaIndexController from 'client/controllers/media/index';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default MediaIndexController.extend({
  queryParams: ['ageRating', 'episodeCount', 'streamers'],
  ageRating: [],
  episodeCount: [1, 100],
  streamers: [],

  availableRatings: ['G', 'PG', 'R', 'R18'],

  _setDirtyValues() {
    this._super(...arguments);
    set(this, 'dirtyEpisodes', get(this, 'episodeCount'));
  }
});
