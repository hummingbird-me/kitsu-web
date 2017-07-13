import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
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
  }
});
