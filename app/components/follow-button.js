import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { notEmpty } from 'ember-computed';
import observer from 'ember-metal/observer';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'button',
  classNameBindings: ['isFollowing:active:inactive'],
  classNames: ['button', 'button--primary'],

  notify: service(),
  session: service(),
  store: service(),
  isFollowing: notEmpty('relationship'),

  didAuthenticate: observer('session.hasUser', function() {
    this._getData();
  }),

  getFollowStatus: task(function* () {
    return yield get(this, 'store').query('follow', {
      filter: {
        follower: get(this, 'session.account.id'),
        followed: get(this, 'user.id')
      }
    }).then(follow => set(this, 'relationship', get(follow, 'firstObject')));
  }).drop(),

  toggleFollow: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isFollowing')) {
      yield get(this, 'relationship').destroyRecord().then(() => {
        set(this, 'relationship', undefined);
        get(this, 'session.account').decrementProperty('followingCount');
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    } else {
      yield get(this, 'store').createRecord('follow', {
        follower: get(this, 'session.account'),
        followed: get(this, 'user')
      }).save().then((record) => {
        set(this, 'relationship', record);
        get(this, 'session.account').incrementProperty('followingCount');
      })
      .catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }).drop(),

  _getData() {
    if (get(this, 'session.hasUser')) {
      get(this, 'getFollowStatus').perform();
    }
  },

  click() {
    get(this, 'toggleFollow').perform();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._getData();
  },
});
