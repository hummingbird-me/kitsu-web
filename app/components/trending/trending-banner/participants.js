import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  getParticipants: task(function* () {
    const type = get(this, 'itemType');
    return yield get(this, 'store').query('library-entry', {
      filter: {
        [`${type}_id`]: get(this, 'item.id'),
        following: get(this, 'session.account.id')
      },
      include: 'user',
      sort: '-updated_at',
      page: { limit: 5 }
    });
  }).drop(),

  init() {
    this._super(...arguments);
    const taskInstance = get(this, 'getParticipants').perform();
    set(this, 'taskInstance', taskInstance);
  },
});
