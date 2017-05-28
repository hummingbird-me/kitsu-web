import Controller from 'ember-controller';
import set from 'ember-metal/set';
import QueryParams from 'ember-parachute';
import { concat } from 'client/utils/computed-macros';

const queryParams = new QueryParams({
  category: {
    defaultValue: 'all',
    refresh: true
  },
  sort: {
    defaultValue: 'newest',
    refresh: true
  },
  query: {
    defaultValue: '',
    refresh: true
  },
  preserveScrollPosition: {
    defaultValue: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  sortOptions: [{
    key: 'newest',
    value: 'users.groups.sort.newest'
  }, {
    key: 'oldest',
    value: 'users.groups.sort.oldest'
  }],
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  },

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    }
  }
});
