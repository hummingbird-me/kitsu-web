import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';
import { concat } from 'client/utils/computed-macros';

const queryParams = new QueryParams({
  filter: {
    defaultValue: 'all',
    refresh: true
  },
  sort: {
    defaultValue: 'best',
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  filterOptions: ['all', 'anime', 'manga'],
  sortOptions: ['best', 'new'],
  reactions: concat('model.reactionsTaskInstance.value', 'model.paginatedRecords'),

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  }
});
