import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { concat } from 'client/utils/computed-macros';

export default Controller.extend({
  queryParams: ['category', 'sort', 'query'],
  category: 'all',
  sort: 'recent',
  query: null,

  sortOptions: ['recent', 'newest', 'oldest'],
  router: service('-routing'),
  groups: concat('model.taskInstance.value', 'model.paginatedRecords'),

  actions: {
    handleCreateClick() {
      if (!get(this, 'session.hasUser')) {
        get(this, 'session').signUpModal();
      } else {
        get(this, 'router').transitionTo('groups.new');
      }
    }
  },
});
