import MediaIndexController, { MEDIA_QUERY_PARAMS } from 'client/controllers/media/index';
import QueryParams from 'ember-parachute';
import { isEmpty } from '@ember/utils';
import { serializeArray, deserializeArray } from 'client/utils/queryable';
import { moment } from 'client/utils/moment';
import { minYearAnime } from 'client/utils/media-minyear';

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
  },
  year: {
    defaultValue: [minYearAnime, moment().year() + 2],
    refresh: true,
    serialize(value) {
      const [lower, upper] = value;
      if (lower === minYearAnime && upper === (moment().year() + 2)) {
        return undefined;
      } if (upper === (moment().year() + 2)) {
        return serializeArray([lower, null]);
      }
      return serializeArray(value);
    },
    deserialize(value = []) {
      const [lower, upper] = deserializeArray(value);
      if (isEmpty(upper)) {
        return [lower, moment().year() + 2];
      }
      return [lower, upper];
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
