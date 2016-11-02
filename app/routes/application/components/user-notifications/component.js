import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  count: 0,
  session: service(),
  store: service(),

  getNotifications: task(function* () {
    // TODO: Should limit the number of notifications pulled here and filter on isRead: false
    yield get(this, 'store').query('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor'
    }).then((groups) => {
      // how many of these haven't been seen?
      const count = groups.reduce((prev, curr) => (prev + (get(curr, 'isSeen') ? 0 : 1)), 0);
      set(this, 'count', get(this, 'count') + count);
      set(this, 'groups', groups);
    });
  }).drop(),

  init() {
    this._super(...arguments);
    get(this, 'getNotifications').perform();
  },

  actions: {
    markSeen() {
      // TODO: API Needed here (will mark notifications here as seen)
    },

    markRead() {
      // TODO: API Needed here (will mark notifications here as read)
    }
  }
});
