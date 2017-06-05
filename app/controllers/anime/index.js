import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import QueryParams from 'ember-parachute';
import { serializeArray, deserializeArray } from 'client/utils/queryable';

const queryParams = new QueryParams(MEDIA_QUERY_PARAMS, {
  ageRating: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return serializeArray(value);
    },
    deserialize(value = []) {
      return deserializeArray(value);
    }
  },
  episodeCount: {
    defaultValue: [1, 100],
    refresh: true,
    serialize(value) {
      const [lower, upper] = value;
      if (lower === 1 && upper === 100) {
        return undefined;
      } else if (upper === 100) {
        return serializeArray([lower, null]);
      } else if (lower === 1) {
        return serializeArray([null, upper]);
      }
      return serializeArray(value);
    },
    deserialize(value = []) {
      const [lower, upper] = deserializeArray(value);
      if (isEmpty(upper)) {
        return [lower, 100];
      } else if (isEmpty(lower) && !isEmpty(upper)) {
        return [1, upper];
      }
      return [lower, upper];
    }
  },
  streamers: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return serializeArray(value);
    },
    deserialize(value = []) {
      return deserializeArray(value);
    }
  },
  season: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return serializeArray(value);
    },
    deserialize(value = []) {
      return deserializeArray(value);
    }
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
