import Controller from 'ember-controller';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['filter', 'query'],
  filter: 'open',
  query: null,

  filterOptions: ['open', 'resolved', 'all'],
  tickets: concat('model.taskInstance.value', 'model.paginatedRecords'),
});
