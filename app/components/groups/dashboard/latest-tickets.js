import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
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
