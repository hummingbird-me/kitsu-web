import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  categoryRoute: 'groups.index',
  queryCache: service(),
  router: service('-routing'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'session.hasUser')) { return; }
    get(this, 'getMemberStatusTask').perform();
  },

  getMemberStatusTask: task(function* () {
    return yield get(this, 'queryCache').query('group-member', {
      filter: {
        group: get(this, 'group.id'),
        user: get(this, 'session.account.id')
      }
    }).then(records => set(this, 'membership', get(records, 'firstObject')));
  }).drop(),

  actions: {
    handleGroupClick() {
      get(this, 'router').transitionTo('groups.group.group-page.index', [get(this, 'group.slug')]);
    }
  }
});
