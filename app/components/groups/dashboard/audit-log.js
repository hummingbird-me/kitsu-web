import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['group-audit-log'],
  queryCache: service(),

  init() {
    this._super(...arguments);
    get(this, 'getLogItemsTask').perform();
  },

  getLogItemsTask: task(function* () {
    return yield get(this, 'queryCache').query('group-action-log', {
      filter: { group: get(this, 'group.id') },
      include: 'user,target',
      sort: '-created_at',
      page: { limit: 10 }
    });
  })
});
