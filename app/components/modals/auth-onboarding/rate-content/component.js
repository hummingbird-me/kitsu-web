import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';

export default Component.extend({
  activeTab: 'anime',
  searchQuery: '',
  media: undefined,
  numRated: 0,

  store: service(),
  session: service(),

  numRatedLeft: computed('numRated', {
    get() {
      if (get(this, 'numRated') > 5) {
        return 0;
      }
      return 5 - get(this, 'numRated');
    }
  }),

  query: task(function* () {
    const mediaType = get(this, 'activeTab');
    const data = yield get(this, 'store').query(mediaType, this._getFilters());
    set(this, 'media', data);
  }).restartable(),

  updateSearchQuery: task(function* (query) {
    set(this, 'searchQuery', query);
    yield timeout(1000);
    get(this, 'query').perform();
  }).restartable(),

  _getFilters() {
    const filters = {};
    const query = get(this, 'searchQuery');
    if (isEmpty(query) === true) {
      filters.sort = '-user_count';
    } else {
      filters.filter = { text: query };
    }
    return filters;
  },

  init() {
    this._super(...arguments);
    set(this, 'itemCache', { anime: [], manga: [] });
    get(this, 'query').perform();
  },

  _addToCache(media, rating) {
    const { modelName } = media.constructor;
    const cache = get(this, 'itemCache');
    cache[modelName].push({
      id: get(media, 'id'),
      rating
    });
  },

  _getFromCache(media) {
    const { modelName } = media.constructor;
    const cache = get(this, 'itemCache');
    console.log(cache, modelName);
    return cache[modelName].find(item => get(item, 'id') === get(media, 'id'));
  },

  actions: {
    changeComponent(component) {
      get(this, 'changeComponent')(component);
    },

    updateTab(tab) {
      set(this, 'activeTab', tab);
      get(this, 'query').perform();
    },

    createLibraryEntry(media, rating) {
      // Increment to provide instant feedback to user
      this.incrementProperty('numRated');
      const user = get(this, 'session.account');
      const entry = get(this, 'store').createRecord('library-entry', {
        status: 'completed',
        rating,
        user,
        media
      });
      entry.save()
        .then(() => this._addToCache(media, rating))
        .catch(() => this.decrementProperty('numRated'));
    },

    getRating(media) {
      const entry = this._getFromCache(media);
      return entry === undefined ? 0 : get(entry, 'rating');
    }
  }
});
