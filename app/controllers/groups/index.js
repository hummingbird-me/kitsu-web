import Controller from 'ember-controller';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['category', 'sort', 'query'],
  category: 'all',
  sort: 'recent',
  query: null,

  sortOptions: ['recent', 'newest', 'oldest'],
  groups: concat('model.taskInstance.value', 'model.paginatedRecords')
});
