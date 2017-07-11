import Controller from 'ember-controller';
import QueryParams from 'ember-parachute';
import { concat } from 'client/utils/computed-macros';

const queryParams = new QueryParams({
  media: {
    defaultValue: 'anime',
    refresh: true
  },
  sort: {
    defaultValue: 'recent',
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  reactions: concat('model.reactionsTaskInstance.value', 'model.paginatedRecords'),

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  }
});
