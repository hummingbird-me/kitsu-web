import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['card', 'user-card', 'col-sm-3'],

  queryCache: service(),

  didReceiveAttrs() {
    get(this, 'getFollowTask').perform();
  },

  getFollowTask: task(function* () {
    const currentUser = get(this, 'session.hasUser') && get(this, 'session.account.id');
    if (currentUser) {
      return yield get(this, 'queryCache').query('follow', {
        filter: {
          follower: currentUser,
          followed: get(this, 'user.id')
        }
      }).then(records => set(this, 'follow', get(records, 'firstObject')));
    }
  }).drop()
});
