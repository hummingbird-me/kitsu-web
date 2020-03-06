import Component from '@ember/component';
import { get, set, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { or, notEmpty } from '@ember/object/computed';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'button',
  attributeBindings: ['isDisabled:disabled'],
  classNameBindings: ['isFollowing:inactive:active'],
  classNames: ['button', 'button--primary'],

  metrics: service(),
  notify: service(),
  store: service(),
  queryCache: service(),
  isFollowing: notEmpty('relationship'),
  isDisabled: or('getFollowStatus.isRunning', 'toggleFollow.isRunning'),

  didAuthenticate: observer('session.hasUser', function() {
    this._getData();
  }),

  getFollowStatus: task(function* () {
    return yield get(this, 'queryCache').query('follow', this._getRequestOptions())
      .then(follow => set(this, 'relationship', get(follow, 'firstObject')));
  }).drop(),

  toggleFollow: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    if (get(this, 'isFollowing')) {
      yield get(this, 'relationship').destroyRecord().then(() => {
        get(this, 'queryCache').invalidateQuery('follow', this._getRequestOptions());
        set(this, 'relationship', undefined);
        get(this, 'session.account').decrementProperty('followingCount');
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    } else {
      yield get(this, 'store').createRecord('follow', {
        follower: get(this, 'session.account'),
        followed: get(this, 'user')
      }).save().then(record => {
        set(this, 'relationship', record);
        get(this, 'session.account').incrementProperty('followingCount');
        get(this, 'metrics').trackEvent({
          category: 'follow',
          action: 'create',
          label: 'user',
          value: get(this, 'user.id')
        });
      }).catch(err => get(this, 'notify').error(errorMessages(err)));
    }
  }).drop(),

  _getData() {
    if (get(this, 'session.hasUser')) {
      get(this, 'getFollowStatus').perform();
    }
  },

  _getRequestOptions() {
    return {
      filter: {
        follower: get(this, 'session.account.id'),
        followed: get(this, 'user.id')
      }
    };
  },

  click() {
    get(this, 'toggleFollow').perform();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'relationship') === undefined && !get(this, 'loading')) {
      this._getData();
    }
  },
});
