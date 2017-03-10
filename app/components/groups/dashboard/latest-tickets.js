import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  store: service(),

  init() {
    this._super(...arguments);
    get(this, 'getLatestTicketsTask').perform();
  },

  getLatestTicketsTask: task(function* () {
    return yield get(this, 'store').query('group-ticket', {
      filter: { query_group: get(this, 'group.id') },
      include: 'user,messages',
      sort: '-created_at',
      page: { limit: 3 }
    });
  })
});
