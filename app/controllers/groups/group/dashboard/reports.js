import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';
import { concat } from 'client/utils/computed-macros';

const queryParams = new QueryParams({
  filter: {
    defaultValue: 'open',
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  filterOptions: ['open', 'resolved', 'all'],
  reports: concat('model.taskInstance.value', 'model.paginatedRecords'),

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  }
});
