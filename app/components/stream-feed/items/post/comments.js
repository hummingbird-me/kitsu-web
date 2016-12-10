import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { prependObjects } from 'client/utils/array-utils';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['stream-item-comments'],
  metrics: service(),
  notify: service(),
  session: service(),
  store: service(),

  getComments: task(function* () {
    return yield get(this, 'store').query('comment', {
      filter: { post_id: get(this, 'post.id'), parent_id: '_none' },
      page: { limit: 2 },
      include: 'user',
      sort: '-created_at'
    });
  }).drop(),

  createComment: task(function* (content) {
    const comment = get(this, 'store').createRecord('comment', {
      content,
      post: get(this, 'post'),
      user: get(this, 'session.account')
    });
    get(this, 'comments').addObject(comment);

    // update comments count
    invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') + 1);
    get(this, 'session.account').incrementProperty('commentsCount');
    yield comment.save().then(() => {
      invokeAction(this, 'trackEngagement', 'comment');
      get(this, 'metrics').trackEvent({ category: 'comment', action: 'create', value: get(this, 'post.id') });
    }).catch((err) => {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
      get(this, 'session.account').decrementProperty('commentsCount');
      get(this, 'notify').error(errorMessages(err));
    });
  }).drop(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'postId') === get(this, 'post.id')) {
      return;
    }
    set(this, 'postId', get(this, 'post.id'));
    set(this, 'comments', []);
    get(this, 'getComments').perform().then((comments) => {
      const content = comments.toArray().reverse();
      set(content, 'links', get(comments, 'links'));
      set(this, 'comments', content);
    }).catch(() => {});
  },

  actions: {
    createComment(component, event, content) {
      if (isEmpty(content) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
        get(this, 'createComment').perform(content);
        component.clear();
      }
    },

    deletedComment(comment) {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
    },

    loadComments(records, links) {
      const content = get(this, 'comments').toArray();
      prependObjects(content, records.toArray().reverse());
      set(this, 'comments', content);
      set(this, 'comments.links', links);
      invokeAction(this, 'trackEngagement', 'click');
    },

    trackEngagement(...args) {
      invokeAction(this, 'trackEngagement', ...args);
    }
  }
});
