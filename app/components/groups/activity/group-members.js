import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['group-members-widget'],
  queryCache: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getMembersTask').perform();
  },

  /**
   * Returns 14 members of the group sorted by the follow relationships of the sessioned user
   * then by the creation date of the group membership
   */
  getMembersTask: task(function* () {
    const sort = ['-created_at'];
    if (get(this, 'session.hasUser')) {
      sort.unshiftObject('following');
    }
    return yield get(this, 'queryCache').query('group-member', {
      include: 'user',
      filter: { group: get(this, 'group.id') },
      page: { limit: 14 },
      sort: sort.join(',')
    });
  }).drop()
});
