import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  queryCache: service(),

  init() {
    this._super(...arguments);
    get(this, 'getLatestTicketsTask').perform();
  },

  getLatestTicketsTask: task(function* () {
    return yield get(this, 'queryCache').query('group-ticket', {
      filter: { group: get(this, 'group.id') },
      include: 'user,firstMessage',
      sort: '-created_at',
      page: { limit: 3 }
    });
  })
});
