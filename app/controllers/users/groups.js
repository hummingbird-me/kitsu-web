import Controller from 'ember-controller';
import set from 'ember-metal/set';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['category', 'sort', 'query'],
  category: 'all',
  sort: 'newest',
  query: null,
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    }
  }
});
