import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, observer } from '@ember/object';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import getter from 'client/utils/getter';

export default Component.extend({
  classNames: ['d-inline'],
  isLiked: false,
  showUsers: false,
  store: service(),
  queryCache: service(),
  metrics: service(),

  resourceFilterKey: getter(function() {
    return `${get(this, 'resource.modelType')}_id`;
  }),

  resourceLikeType: getter(function() {
    return `${get(this, 'resource.modelType')}-like`;
  }),

  getLikes: task(function* () {
    const key = get(this, 'resourceFilterKey');
    return yield get(this, 'queryCache').query(get(this, 'resourceLikeType'), {
      filter: { [key]: get(this, 'resource.id') },
      fields: { users: ['avatar', 'name', 'slug'].join(',') },
      page: { limit: 4 },
      include: 'user'
    }).then(likes => {
      set(this, 'likes', likes.toArray());
      set(this, 'likes.links', get(likes, 'links'));

      // look up session users like status if authenticated
      if (get(this, 'session.isAuthenticated') === true) {
        const like = likes.findBy('user.id', get(this, 'session.account.id'));
        if (like === undefined) {
          if (get(likes, 'length') >= 4) {
            this._getStatus();
          }
        } else {
          set(this, 'isLiked', true);
        }
      }
    }).catch(() => {});
  }).drop(),

  getLocalLike: task(function* () {
    const type = get(this, 'resourceLikeType');
    return yield get(this, 'queryCache').query(type, this._getRequestOptions());
  }).drop(),

  createLike: task(function* () {
    const key = get(this, 'resource.modelType');
    const like = get(this, 'store').createRecord(get(this, 'resourceLikeType'), {
      [key]: get(this, 'resource'),
      user: get(this, 'session.account')
    });

    // provide instant feedback to user
    get(this, 'likes').addObject(like);
    set(this, 'isLiked', true);
    invokeAction(this, 'likesCountUpdate', get(this, 'likesCount') + 1);

    // commit and handle error
    yield like.save().then(() => {
      invokeAction(this, 'onCreate');
      get(this, 'metrics').trackEvent({ category: key, action: 'like', value: get(this, 'resource.id') });
    }).catch(() => {
      get(this, 'likes').removeObject(like);
      set(this, 'isLiked', false);
      invokeAction(this, 'likesCountUpdate', get(this, 'likesCount') - 1);
    });
  }).drop(),

  destroyLike: task(function* () {
    const like = get(this, 'likes').findBy('user.id', get(this, 'session.account.id'));

    // instant feedback
    set(this, 'isLiked', false);
    invokeAction(this, 'likesCountUpdate', get(this, 'likesCount') - 1);

    // commit and handle error
    yield like.destroyRecord().then(() => {
      get(this, 'likes').removeObject(like);
      const type = get(this, 'resouceLikeType');
      get(this, 'queryCache').invalidateQuery(type, this._getRequestOptions());
    }).catch(() => {
      set(this, 'isLiked', true);
      invokeAction(this, 'likesCountUpdate', get(this, 'likesCount') + 1);
    });
  }).drop(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'idWas') !== get(this, 'resource.id')) {
      this._getLikes();
    }
    set(this, 'idWas', get(this, 'resource.id'));
  },

  _getLikes() {
    set(this, 'likes', []);
    set(this, 'isLiked', false);
    if (get(this, 'likesCount') > 0) {
      get(this, 'getLikes').perform();
    }
  },

  _getStatus() {
    get(this, 'getLocalLike').perform().then(records => {
      const record = get(records, 'firstObject');
      if (record !== undefined) {
        set(record, 'user', get(this, 'session.account'));
        get(this, 'likes').addObject(record);
        set(this, 'isLiked', true);
      }
    }).catch(() => {});
  },

  _getRequestOptions() {
    const key = get(this, 'resourceFilterKey');
    return {
      filter: { [key]: get(this, 'resource.id'), user_id: get(this, 'session.account.id') }
    };
  },

  _didAuthenticate: observer('session.hasUser', function() {
    this._getLikes();
  }),

  actions: {
    toggleLike() {
      if (get(this, 'session.hasUser') === false) {
        return get(this, 'session.signUpModal')();
      }

      if (get(this, 'createLike.isRunning') || get(this, 'destroyLike.isRunning')) {
        return;
      }

      const isLiked = get(this, 'isLiked');
      if (isLiked === true) {
        get(this, 'destroyLike').perform();
      } else {
        get(this, 'createLike').perform();
      }
    },

    toggleModal() {
      if (get(this, 'likesCount') > 0) {
        this.toggleProperty('modalOpen');
      }
    }
  }
});
