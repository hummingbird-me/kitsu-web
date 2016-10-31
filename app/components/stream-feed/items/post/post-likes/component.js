import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['stream-item-activity'],
  isLiked: false,

  session: service(),
  store: service(),
  metrics: service(),

  getLikes: task(function* () {
    return yield get(this, 'store').query('post-like', {
      filter: { post_id: get(this, 'post.id') },
      page: { limit: 4 },
      include: 'user'
    });
  }).drop(),

  getStatus: task(function* () {
    return yield get(this, 'store').query('post-like', {
      filter: { post_id: get(this, 'post.id'), user_id: get(this, 'session.account.id') }
    });
  }).drop(),

  createLike: task(function* () {
    // can't like a post that isn't saved yet
    if (isEmpty(get(this, 'post.id')) === true) {
      return;
    }

    const like = get(this, 'store').createRecord('post-like', {
      post: get(this, 'post'),
      user: get(this, 'session.account')
    });

    // provide instant feedback to user
    get(this, 'likes').addObject(like);
    set(this, 'isLiked', true);
    invokeAction(this, 'likesCountUpdate', get(this, 'post.likesCount') + 1);

    // commit
    yield like.save().then(() => {
      invokeAction(this, 'trackStream', 'click', 'like');
    }).catch(() => {
      get(this, 'likes').removeObject(like);
      set(this, 'isLiked', false);
      invokeAction(this, 'likesCountUpdate', get(this, 'post.likesCount') - 1);
    });
  }).drop(),

  destroyLike: task(function* () {
    const like = get(this, 'likes').findBy('user.id', get(this, 'session.account.id'));

    // instant feedback
    set(this, 'isLiked', false);
    invokeAction(this, 'likesCountUpdate', get(this, 'post.likesCount') - 1);

    // commit
    yield like.destroyRecord().then(() => {
      get(this, 'likes').removeObject(like);
    }).catch(() => {
      set(this, 'isLiked', true);
      invokeAction(this, 'likesCountUpdate', get(this, 'post.likesCount') + 1);
    });
  }).drop(),

  init() {
    this._super(...arguments);
    get(this, 'getLikes').perform().then((likes) => {
      set(this, 'likes', likes.toArray());
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
    });
  },

  _getStatus() {
    get(this, 'getStatus').perform().then((records) => {
      const record = get(records, 'firstObject');
      if (record !== undefined) {
        set(record, 'user', get(this, 'session.account'));
        get(this, 'likes').addObject(record);
        set(this, 'isLiked', true);
      }
    });
  },

  actions: {
    toggleLike() {
      if (get(this, 'session.hasUser') === false) {
        return get(this, 'session.signUpModal')();
      }
      const isLiked = get(this, 'isLiked');
      if (isLiked === true) {
        get(this, 'destroyLike').perform();
      } else {
        get(this, 'createLike').perform();
      }
    }
  }
});
