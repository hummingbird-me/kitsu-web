import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  queryCache: service(),

  init() {
    this._super(...arguments);
    get(this, 'getLatestReportsTask').perform();
  },

  getLatestReportsTask: task(function* () {
    return yield get(this, 'queryCache').query('group-report', {
      filter: { group: get(this, 'group.id') },
      include: 'user',
      sort: '-created_at',
      page: { limit: 3 }
    });
  })
});
