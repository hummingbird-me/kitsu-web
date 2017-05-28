import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { moment } from 'client/utils/moment';
import { concat } from 'client/utils/computed-macros';

export const MEDIA_QUERY_PARAMS = {
  averageRating: {
    defaultValue: [5, 100],
    refresh: true,
    serialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (lower === 5 && upper === 100) {
          return undefined;
        } else if (lower === 5) {
          return `5..${upper}`;
        }
        return value;
      }
    },
    deserialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (isEmpty(lower)) {
          return [5, upper];
        }
        return value;
      }
    }
  },
  genres: {
    defaultValue: [],
    refresh: true
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
    refresh: true
  },
  year: {
    defaultValue: [1907, moment().year() + 1],
    refresh: true,
    serialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (upper === (moment().year() + 1)) {
          return `${lower}..`;
        }
        return value;
      }
    },
    deserialize(value) {
      if (value !== undefined) {
        const [lower, upper] = value;
        if (isEmpty(upper)) {
          return [lower, moment().year() + 1];
        }
        return value;
      }
    }
  }
};

export default Controller.extend({
  sortOptions: ['popularity', 'rating', 'date'],
  taskValue: concat('model.taskInstance.value', 'model.paginatedRecords'),

  init() {
    this._super(...arguments);
    set(this, 'maxYear', moment().year() + 1);
    const mediaType = get(this, 'mediaType');
    set(this, 'isAnime', mediaType === 'anime');
    set(this, 'isManga', mediaType === 'manga');
  },

  actions: {
    formatValue(value) {
      return parseFloat(parseFloat(value).toFixed(0));
    }
  },

  _handleScroll() {
    if (document.scrollTop >= 51) {
      document.getElementsByClassName('filter-options').forEach((element) => {
        element.classList.add('scrolled');
      });
      document.getElementsByClassName('search-media').forEach((element) => {
        element.classList.add('scrolled');
      });
    } else {
      document.getElementsByClassName('filter-options').forEach((element) => {
        element.classList.remove('scrolled');
      });
      document.getElementsByClassName('search-media').forEach((element) => {
        element.classList.remove('scrolled');
      });
    }
  },

  _setDirtyValues() {
    set(this, 'dirtyYear', get(this, 'year'));
    set(this, 'dirtyRating', get(this, 'averageRating'));
  }
});
