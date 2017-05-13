import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  getRecentActivity: task(function* () {
    return yield get(this, 'queryCache').query('feed', {
      type: 'timeline',
      id: get(this, 'session.account.id'),
      filter: { kind: 'media' },
      include: 'actor,media',
      page: { limit: 10 }
    });
  }),

  init() {
    this._super(...arguments);
    const taskInstance = get(this, 'getRecentActivity').perform();
    set(this, 'taskInstance', taskInstance);
  }
});
