import MediaIndexController from 'client/controllers/media/index';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default MediaIndexController.extend({
  queryParams: ['ageRating', 'episodeCount', 'streamers', 'season'],
  ageRating: [],
  episodeCount: [1, 100],
  streamers: [],
  season: [],

  availableRatings: ['G', 'PG', 'R', 'R18'],
  availableSeasons: ['spring', 'summer', 'fall', 'winter'],

  _setDirtyValues() {
    this._super(...arguments);
    set(this, 'dirtyEpisodes', get(this, 'episodeCount'));
  }
});
