import Component from 'ember-component';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['stream-item-activity'],
  session: service(),
  store: service(),

  isLiked: computed('likes.[]', 'session.account', {
    get() {
      if (get(this, 'session.isAuthenticated') === false ||
        get(this, 'likes') === undefined) {
        return false;
      }
      const likes = get(this, 'likes');
      const user = get(this, 'session.account');
      return likes.findBy('user.id', get(user, 'id')) !== undefined;
    }
  }).readOnly(),

  getLikes: task(function* () {
    return yield get(this, 'store').query('post-like', {
      filter: { post_id: get(this, 'post.id') },
      page: { limit: 4 },
      include: 'user'
    });
  }).drop(),

  createLike: task(function* () {
    if (isEmpty(get(this, 'post.id')) === true) {
      return;
    }
    const like = get(this, 'store').createRecord('post-like', {
      post: get(this, 'post'),
      user: get(this, 'session.account')
    });
    get(this, 'likes').addObject(like);
    invokeAction(this, 'onCreate');
    yield like.save()
      .then(record => invokeAction(this, 'onSave', record))
      .catch((error) => {
        get(this, 'likes').removeObject(like);
        invokeAction(this, 'onSave', like, error);
      });
  }).drop(),

  destroyLike: task(function* () {
    const like = get(this, 'likes').findBy('user.id', get(this, 'session.account.id'));
    yield like.destroyRecord()
      .then((record) => {
        get(this, 'likes').removeObject(like);
        invokeAction(this, 'onDestroy', record);
      })
      .catch(error => invokeAction(this, 'onDestroy', like, error));
  }).drop(),

  init() {
    this._super(...arguments);
    get(this, 'getLikes').perform().then(likes => set(this, 'likes', likes.toArray()));
  },

  actions: {
    toggleLike() {
      if (get(this, 'session.isAuthenticated') === false) {
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
