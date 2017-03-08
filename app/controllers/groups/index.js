import Controller from 'ember-controller';
import set from 'ember-metal/set';
import { reads } from 'ember-computed';
import { task, timeout } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['category', 'sort', 'query'],
  category: 'all',
  sort: 'recent',
  query: null,

  sortOptions: ['recent', 'newest', 'oldest'],
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),
  dirtyQuery: reads('query'),

  debouncedQueryTask: task(function* (query) {
    set(this, 'dirtyQuery', query);
    yield timeout(250);
    set(this, 'query', query);
  }).restartable()
});
