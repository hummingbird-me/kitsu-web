import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Component.extend(InfinitePagination, {
  activeTab: 'anime',
  searchQuery: '',
  numRated: 0,
  store: service(),
  media: concat('queryTask.lastSuccessful.value', 'paginatedRecords'),

  numRatedLeft: computed('numRated', function() {
    if (get(this, 'numRated') > 5) {
      return 0;
    }
    return 5 - get(this, 'numRated');
  }),

  init() {
    this._super(...arguments);
    get(this, 'queryTask').perform();
  },

  queryTask: task(function* () {
    set(this, 'paginatedRecords', []);
    const mediaType = get(this, 'activeTab');
    const filters = { page: { limit: 20 } };
    const query = get(this, 'searchQuery');
    if (isEmpty(query) === true) {
      filters.sort = '-user_count';
    } else {
      filters.filter = { text: query };
    }
    return yield get(this, 'store').query(mediaType, filters).then((records) => {
      set(this, 'paginatedRecords', []);
      this.updatePageState(records);
      return records;
    });
  }).restartable(),

  updateSearchQuery: task(function* (query) {
    set(this, 'searchQuery', query);
    yield timeout(1000);
    yield get(this, 'queryTask').perform();
  }).restartable(),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    },

    updateTab(tab) {
      set(this, 'activeTab', tab);
      get(this, 'queryTask').perform();
    },

    createLibraryEntry(media, rating) {
      const user = get(this, 'session.account');
      const type = get(media, 'modelType');
      const entry = get(this, 'store').createRecord('library-entry', {
        status: 'completed',
        rating,
        user,
        [type]: media
      });
      this.incrementProperty('numRated');
      entry.save().catch(() => this.decrementProperty('numRated'));
    }
  }
});
