import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Component.extend({
  classNames: ['group-result'],
  categoryRoute: 'groups.index',
  queryCache: service(),
  router: service('-routing'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'session.hasUser')) { return; }
    get(this, 'queryCache').query('group-member', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'session.account.id')
      }
    }).then(records => set(this, 'membership', get(records, 'firstObject')));
  },

  actions: {
    handleGroupClick() {
      get(this, 'router').transitionTo('groups.group.group-page.index', [get(this, 'group.slug')]);
    }
  }
});
