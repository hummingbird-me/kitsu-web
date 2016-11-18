import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { prependObjects } from 'client/utils/array-utils';

export default Component.extend({
  classNames: ['stream-item-comments'],
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
    invokeAction(this, 'countUpdate', get(this, 'post.commentsCount') + 1);
    get(this, 'session.account').incrementProperty('commentsCount');
    yield comment.save().then(() => {
      invokeAction(this, 'trackEngagement', 'comment');
    }).catch(() => {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'countUpdate', get(this, 'post.commentsCount') - 1);
      get(this, 'session.account').decrementProperty('commentsCount');
    });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'comments', []);
    get(this, 'getComments').perform().then((comments) => {
      const content = comments.toArray().reverse();
      set(content, 'links', get(comments, 'links'));
      set(this, 'comments', content);
    }).catch(() => {});
  },

  actions: {
    createComment(component, event, content) {
      const { metaKey, ctrlKey } = event;
      if (metaKey === true || ctrlKey === true) {
        get(this, 'createComment').perform(content);
        this.$('.add-comment').val('');
        component.resize();
      }
    },

    loadComments(records, links) {
      const content = get(this, 'comments').toArray();
      prependObjects(content, records);
      set(this, 'comments', content);
      set(this, 'comments.links', links);
      invokeAction(this, 'trackEngagement', 'click');
    },

    trackEngagement(...args) {
      invokeAction(this, 'trackEngagement', ...args);
    }
  }
});
