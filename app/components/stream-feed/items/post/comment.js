import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { scheduleOnce } from 'ember-runloop';
import { prependObjects } from 'client/utils/array-utils';

export default Component.extend({
  classNameBindings: ['comment.isNew:new-comment'],
  isLiked: false,
  isReplying: false,
  isTopLevel: false,

  i18n: service(),
  notify: service(),
  session: service(),
  store: service(),

  getLocalLike: task(function* () {
    return yield get(this, 'store').query('comment-like', {
      filter: { comment_id: get(this, 'comment.id'), user_id: get(this, 'session.account.id') }
    }).then((records) => {
      const like = get(records, 'firstObject');
      set(this, 'like', like);
      set(this, 'isLiked', like !== undefined);
    }).catch(() => {});
  }).drop(),

  getReplies: task(function* () {
    return yield get(this, 'store').query('comment', {
      include: 'user',
      filter: { post_id: get(this, 'post.id'), parent_id: get(this, 'comment.id') },
      page: { limit: 2 },
      sort: '-created_at'
    });
  }).drop(),

  createReply: task(function* (content) {
    const reply = get(this, 'store').createRecord('comment', {
      content,
      post: get(this, 'post'),
      parent: get(this, 'comment'),
      user: get(this, 'session.account')
    });

    invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') + 1);
    get(this, 'replies').addObject(reply);
    set(this, 'isReplying', false);

    yield reply.save()
      .then(() => invokeAction(this, 'trackEngagement', 'comment', `Comment:${get(this, 'comment.id')}`))
      .catch(() => {
        invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') - 1);
        get(this, 'replies').removeObject(reply);
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
      invokeAction(this, 'trackEngagement', 'like', `Comment:${get(this, 'comment.id')}`);
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
    set(this, 'replies', []);

    if (get(this, 'session.hasUser') === true) {
      if (get(this, 'comment.id') !== null) {
        get(this, 'getLocalLike').perform();
      }
    }

    if (get(this, 'isTopLevel') === true && get(this, 'comment.repliesCount') > 0) {
      get(this, 'getReplies').perform().then((replies) => {
        const content = replies.toArray().reverse();
        set(this, 'replies', content);
        set(this, 'replies.links', get(replies, 'links'));
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
    },

    blockUser() {
      const block = get(this, 'store').createRecord('block', {
        user: get(this, 'session.account'),
        blocked: get(this, 'comment.user')
      });
      block.save().then(() => {}).catch(() => (
        get(this, 'notify').error(get(this, 'i18n').t('errors.request'))
      ));
    },

    createReply(component, event, content) {
      if (isEmpty(content) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        get(this, 'createReply').perform(content);
        component.clear();
      }
    },

    showReply() {
      if (get(this, 'isTopLevel') === true) {
        this.toggleProperty('isReplying');
      } else {
        invokeAction(this, 'onReply', get(this, 'comment.user.name'));
      }
    },

    onReply(name) {
      this.toggleProperty('isReplying');
      scheduleOnce('afterRender', () => this.$('.reply-comment').val(`@${name} `));
    },

    loadReplies(records, links) {
      const content = get(this, 'replies').toArray();
      prependObjects(content, records);
      set(this, 'replies', content);
      set(this, 'replies.links', links);
      invokeAction(this, 'trackEngagement', 'click', `Comment:${get(this, 'comment.id')}`);
    },

    trackEngagement(...args) {
      invokeAction(this, 'trackEngagement', ...args);
    }
  }
});
