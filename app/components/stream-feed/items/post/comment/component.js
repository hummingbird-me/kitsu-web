import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNameBindings: ['comment.isNew:new-comment'],
  isLiked: false,

  session: service(),
  store: service(),

  getStatus: task(function* () {
    return yield get(this, 'store').query('comment-like', {
      filter: { comment_id: get(this, 'comment.id'), user_id: get(this, 'session.account.id') }
    });
  }).drop(),

  createLike: task(function* () {
    if (isEmpty(get(this, 'comment.id')) === true) {
      return;
    }
    const like = get(this, 'store').createRecord('comment-like', {
      comment: get(this, 'comment'),
      user: get(this, 'session.account')
    });
    set(this, 'isLiked', true);
    invokeAction(this, 'likesCountUpdate', get(this, 'comment.likesCount') + 1);
    yield like.save().then((record) => {
      set(this, 'like', record);
    }).catch(() => {
      set(this, 'isLiked', false);
      invokeAction(this, 'likesCountUpdate', get(this, 'comment.likesCount') - 1);
    });
  }).drop(),

  destroyLike: task(function* () {
    const like = get(this, 'like');
    set(this, 'isLiked', false);
    invokeAction(this, 'likesCountUpdate', get(this, 'comment.likesCount') - 1);
    yield like.destroyRecord().catch(() => {
      set(this, 'isLiked', true);
      invokeAction(this, 'likesCountUpdate', get(this, 'comment.likesCount') + 1);
    });
  }).drop(),

  init() {
    this._super(...arguments);
    if (get(this, 'session.hasUser') === true) {
      get(this, 'getStatus').perform().then((records) => {
        const like = get(records, 'firstObject');
        set(this, 'like', like);
        set(this, 'isLiked', like !== undefined);
      });
    }
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
