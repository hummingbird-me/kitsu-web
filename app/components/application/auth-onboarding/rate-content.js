import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
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
    return yield this.queryPaginated(mediaType, filters).then(records => {
      set(this, 'paginatedRecords', []);
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

    libraryEntryDoingUpdate(entry, task) {
      if (get(entry, 'rating')) {
        this.incrementProperty('numRated');
        task.catch(() => this.decrementProperty('numRated'));
      }
    }
  }
});
