import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { scheduleOnce } from 'ember-runloop';
import { prependObjects } from 'client/utils/array-utils';
import errorMessages from 'client/utils/error-messages';
import moment from 'moment';

export default Component.extend({
  classNameBindings: ['comment.isNew:new-comment'],
  isLiked: false,
  isEditing: false,
  isReplying: false,
  isTopLevel: false,

  metrics: service(),
  notify: service(),
  session: service(),
  store: service(),

  commentEdited: computed('comment.createdAt', 'comment.updatedAt', {
    get() {
      return moment(get(this, 'comment.createdAt')).isSame(get(this, 'comment.updatedAt')) === false;
    }
  }).readOnly(),

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
      .then(() => {
        invokeAction(this, 'trackEngagement', 'comment');
        get(this, 'metrics').trackEvent({ category: 'comment', action: 'reply', value: get(this, 'comment.id') });
      })
      .catch((err) => {
        invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') - 1);
        get(this, 'replies').removeObject(reply);
        get(this, 'notify').error(errorMessages(err));
      });
  }).drop(),

  updateComment: task(function* () {
    yield get(this, 'comment').save().catch(err => get(this, 'notify').error(errorMessages(err)));
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
    }).catch((err) => {
      set(this, 'isLiked', false);
      invokeAction(this, 'likesCountUpdate', get(this, 'comment.likesCount') - 1);
      get(this, 'notify').error(errorMessages(err));
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
        set(content, 'links', get(replies, 'links'));
        set(this, 'replies', content);
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
      block.save().then(() => {}).catch(err => (
        get(this, 'notify').error(errorMessages(err))
      ));
    },

    updateComment(component, event, content) {
      if (isEmpty(content) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
        get(this, 'updateComment').perform();
        component.clear();
        this.toggleProperty('isEditing');
      }
    },

    deleteComment() {
      get(this, 'comment').destroyRecord()
        .then(() => invokeAction(this, 'onDelete', get(this, 'comment')))
        .catch((err) => {
          get(this, 'comment').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    deletedReply(reply) {
      get(this, 'replies').removeObject(reply);
      invokeAction(this, 'replyCountUpdate', get(this, 'comment.repliesCount') - 1);
    },

    createReply(component, event, content) {
      if (isEmpty(content) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
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
      invokeAction(this, 'trackEngagement', 'click');
    },

    trackEngagement(label) {
      invokeAction(this, 'trackEngagement', label, `Comment:${get(this, 'comment.id')}`);
    }
  }
});
