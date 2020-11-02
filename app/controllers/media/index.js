import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { moment } from 'client/utils/moment';
import { concat } from 'client/utils/computed-macros';
import { minYearAnime, minYearManga } from 'client/utils/media-minyear';
import { serializeArray, deserializeArray } from 'client/utils/queryable';

export const MEDIA_QUERY_PARAMS = {
  averageRating: {
    defaultValue: [5, 100],
    refresh: true,
    serialize(value) {
      const [lower, upper] = value;
      if (lower === 5 && upper === 100) {
        return undefined;
      } if (lower === 5) {
        return serializeArray([5, upper]);
      }
      return serializeArray(value);
    },
    deserialize(value = []) {
      const [lower, upper] = deserializeArray(value);
      if (isEmpty(lower)) {
        return [5, upper];
      }
      return [lower, upper];
    }
  },
  categories: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return serializeArray(value);
    },
    deserialize(value = []) {
      return deserializeArray(value);
    }
  },
  text: {
    defaultValue: '',
    refresh: true
  },
  sort: {
    defaultValue: 'popularity',
    refresh: true
  },
  subtype: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return serializeArray(value);
    },
    deserialize(value = []) {
      return deserializeArray(value);
    }
  },
  unitCount: {
    defaultValue: [1, 100],
    refresh: true,
    serialize(value) {
      const [lower, upper] = value;
      if (lower === 1 && upper === 100) {
        return undefined;
      } if (upper === 100) {
        return serializeArray([lower, null]);
      } if (lower === 1) {
        return serializeArray([null, upper]);
      }
      return serializeArray(value);
    },
    deserialize(value = []) {
      const [lower, upper] = deserializeArray(value);
      if (isEmpty(upper)) {
        return [lower, 100];
      } if (isEmpty(lower) && !isEmpty(upper)) {
        return [1, upper];
      }
      return [lower, upper];
    }
  }
};

export default Controller.extend({
  sortOptions: ['popularity', 'rating', 'date', 'recent'],
  taskValue: concat('model.taskInstance.value', 'model.paginatedRecords'),

  init() {
    this._super(...arguments);
    const mediaType = get(this, 'mediaType');
    set(this, 'isAnime', mediaType === 'anime');
    set(this, 'isManga', mediaType === 'manga');
    set(this, 'minYear', get(this, 'isAnime') ? minYearAnime : minYearManga);
    set(this, 'maxYear', moment().year() + 2);
  },

  actions: {
    formatValue(value) {
      return parseFloat(parseFloat(value).toFixed(0));
    }
  },

  _setDirtyValues() {
    set(this, 'dirtyYear', get(this, 'year'));
    set(this, 'dirtyRating', get(this, 'averageRating'));
    set(this, 'dirtyUnits', get(this, 'unitCount'));
  }
});
