import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  classNames: ['group-members-widget'],

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getMembersTask').perform();
  },

  /**
   * Returns 14 members of the group sorted by the follow relationships of the sessioned user
   * then by the creation date of the group membership
   */
  getMembersTask: task(function* () {
    return yield get(this, 'store').query('group-member', {
      include: 'user',
      filter: { group: get(this, 'group.id') },
      page: { limit: 14 },
      sort: 'following,-created_at'
    });
  }).restartable()
});
