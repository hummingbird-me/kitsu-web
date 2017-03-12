import Controller from 'ember-controller';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['filter'],
  filter: 'open',

  filterOptions: ['open', 'resolved', 'all'],
  reports: concat('model.taskInstance.value', 'model.paginatedRecords'),
});
