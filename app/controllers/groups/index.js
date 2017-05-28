import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import QueryParams from 'ember-parachute';
import { concat } from 'client/utils/computed-macros';

const queryParams = new QueryParams({
  category: {
    defaultValue: 'all',
    refresh: true
  },
  sort: {
    defaultValue: 'featured',
    refresh: true
  },
  query: {
    defaultValue: '',
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  router: service('-routing'),
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.send('refreshModel');
    }
  },

  actions: {
    updateQueryParam(property, value) {
      set(this, property, value);
    },

    handleCreateClick() {
      if (!get(this, 'session.hasUser')) {
        get(this, 'session').signUpModal();
      } else {
        get(this, 'router').transitionTo('groups.new');
      }
    }
  },
});
