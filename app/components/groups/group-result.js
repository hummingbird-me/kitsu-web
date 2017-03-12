import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  categoryRoute: 'groups.index',
  router: service('-routing'),

  actions: {
    handleGroupClick() {
      get(this, 'router').transitionTo('groups.group.group-page.index', [get(this, 'group.slug')]);
    }
  }
});
