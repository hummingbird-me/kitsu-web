import Controller from 'ember-controller';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import { concat } from 'client/utils/computed-macros';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Controller.extend({
  queryParams: ['media', 'status', 'sort', 'title'],
  media: 'anime',
  status: 'current',
  sort: 'title',
  title: '',

  layoutStyle: 'grid',

  cache: storageFor('last-used'),
  libraryEntries: concat('model.taskInstance.value', 'model.paginatedRecords'),

  init() {
    this._super(...arguments);
    set(this, 'mediaTypes', ['anime', 'manga']);
    set(this, 'statuses', ['all', ...LIBRARY_STATUSES]);
  },

  searchTask: task(function* (query) {
    yield timeout(500);
    set(this, 'title', query);
  }).restartable()
});
