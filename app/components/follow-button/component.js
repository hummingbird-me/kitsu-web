import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { notEmpty } from 'ember-computed';

export default Component.extend({
  tagName: 'button',
  classNames: ['button', 'button--primary'],

  session: service(),
  store: service(),
  isFollowing: notEmpty('relationship'),

  getFollowStatus: task(function* () {
    return yield get(this, 'store').query('follow', {
      filter: {
        follower: get(this, 'session.account.id'),
        followed: get(this, 'user.id')
      }
    }).then(follow => set(this, 'relationship', get(follow, 'firstObject')));
  }),

  toggleFollow: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isFollowing')) {
      yield get(this, 'relationship').destroyRecord()
        .then(() => set(this, 'relationship', undefined))
        .catch(() => { /* TODO: Feedback */ });
    } else {
      yield get(this, 'store').createRecord('follow', {
        follower: get(this, 'session.account'),
        followed: get(this, 'user')
      }).save()
        .then(record => set(this, 'relationship', record))
        .catch(() => { /* TODO: Feedback */ });
    }
  }),

  click() {
    get(this, 'toggleFollow').perform();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'session.isAuthenticated')) {
      get(this, 'getFollowStatus').perform();
    }
  }
});
