import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);
    get(this, 'getGroupsTask').perform();
  },

  getGroupsTask: task(function* () {
    return yield get(this, 'store').query('group-member', {
      filter: { user: get(this, 'session.account.id') },
      include: 'group',
      page: { limit: 8 },
      sort: '-group.last_activity_at'
    }).then(records => records.map(record => get(record, 'group')));
  })
});
