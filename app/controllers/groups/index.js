import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['category', 'sort', 'query'],
  category: 'all',
  sort: 'recent',
  query: null,

  router: service('-routing'),
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),

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
