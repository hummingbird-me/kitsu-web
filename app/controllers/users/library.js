import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import { concat } from 'client/utils/computed-macros';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

const queryParams = new QueryParams({
  media: {
    defaultValue: 'anime',
    refresh: true
  },
  status: {
    defaultValue: 'current',
    refresh: true
  },
  sort: {
    defaultValue: 'title',
    refresh: true
  },
  title: {
    defaultValue: '',
    refresh: true
  },
  preserveScrollPosition: {
    defaultValue: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  cache: storageFor('last-used'),
  libraryEntries: concat('model.taskInstance.value', 'model.paginatedRecords'),

  filteredLibraryEntries: computed('libraryEntries.@each.{status,isDeleted}', function() {
    let entries = get(this, 'libraryEntries');
    entries = entries.filterBy('isDeleted', false);
    const { status } = get(this, 'allQueryParams');
    if (status !== 'all') {
      entries = entries.filterBy('status', status);
    }
    return entries;
  }).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'mediaTypes', ['anime', 'manga']);
    set(this, 'statuses', ['all', ...LIBRARY_STATUSES]);
    set(this, 'layoutStyle', get(this, 'cache.libraryLayout') || 'grid');
  },

  queryParamsDidChange({ shouldRefresh, queryParams }) {
    // save to cache
    if (get(this, 'session').isCurrentUser(get(this, 'user'))) {
      const cache = get(this, 'cache');
      set(cache, 'libraryType', get(queryParams, 'media'));
      set(cache, 'librarySort', get(queryParams, 'sort'));
    }
    // refresh data
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  },

  searchTask: task(function* (query) {
    yield timeout(250);
    set(this, 'title', query);
  }).restartable(),

  actions: {
    updateLayout(layout) {
      set(this, 'layoutStyle', layout);
      const cache = get(this, 'cache');
      set(cache, 'libraryLayout', layout);
    }
  }
});
