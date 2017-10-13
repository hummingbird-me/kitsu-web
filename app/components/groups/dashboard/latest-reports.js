import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
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
