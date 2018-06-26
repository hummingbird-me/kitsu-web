import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);
    if (!this.get('session.isAuthenticated')) { return; }
    get(this, 'getGroupsTask').perform();
  },

  getGroupsTask: task(function* () {
    return yield get(this, 'store').query('group-member', {
      filter: { user: get(this, 'session.account.id') },
      fields: {
        groupMembers: ['unreadCount', 'group'].join(','),
        groups: ['name', 'slug', 'avatar'].join(',')
      },
      include: 'group',
      page: { limit: 8 },
      sort: '-group.last_activity_at'
    });
  })
});
