import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import QueryParams from 'ember-parachute';

const queryParams = new QueryParams(MEDIA_QUERY_PARAMS).extend({
  ageRating: {
    defaultValue: [],
    refresh: true
  },
  episodeCount: {
    defaultValue: [1, 100],
    refresh: true,
    serialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (lower === 1 && upper === 100) {
          return undefined;
        } else if (upper === 100) {
          return `${lower}..`;
        } else if (lower === 1) {
          return `..${upper}`;
        }
        return value;
      }
    },
    deserialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (isEmpty(upper)) {
          return [lower, 100];
        } else if (isEmpty(lower) && !isEmpty(upper)) {
          return [1, upper];
        }
        return value;
      }
    }
  },
  streamers: {
    defaultValue: [],
    refresh: true
  },
  season: {
    defaultValue: [],
    refresh: true
  }
});

export default MediaIndexController.extend(queryParams.Mixin, {
  mediaType: 'anime',
  availableRatings: ['G', 'PG', 'R', 'R18'],
  availableSeasons: ['spring', 'summer', 'fall', 'winter'],
  availableSubtypes: ['tv', 'special', 'ona', 'ova', 'movie', 'music'],

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refresh');
    }
  },

  _setDirtyValues() {
    this._super(...arguments);
    set(this, 'dirtyEpisodes', get(this, 'episodeCount'));
  }
});
