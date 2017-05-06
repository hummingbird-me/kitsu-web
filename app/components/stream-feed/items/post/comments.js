import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { unshiftObjects } from 'client/utils/array-utils';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  classNames: ['stream-item-comments'],
  metrics: service(),
  notify: service(),
  store: service(),
  router: service('-routing'),

  getComments: task(function* () {
    return yield this.queryPaginated('comment', {
      filter: { post_id: get(this, 'post.id'), parent_id: '_none' },
      fields: { users: ['avatar', 'name'].join(',') },
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
      invokeAction(this, 'updateFollow');
      invokeAction(this, 'trackEngagement', 'comment');
      get(this, 'metrics').trackEvent({ category: 'comment', action: 'create', value: get(this, 'post.id') });
    }).catch((err) => {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
      get(this, 'session.account').decrementProperty('commentsCount');
      get(this, 'notify').error(errorMessages(err));
    });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'comments', []);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    // display single comment and its thread or load the comments for the post
    if (get(this, 'comment') !== undefined) {
      if (get(this, 'comment.id') === get(this, 'commentIdWas')) {
        return;
      }
      set(this, 'commentIdWas', get(this, 'comment.id'));
      set(this, 'comments', []);
      get(this, 'comments').addObject(get(this, 'comment'));
    } else {
      // don't reload if the we have received attrs but the post hasn't changed
      if (get(this, 'post.id') === get(this, 'postIdWas')) {
        return;
      }
      set(this, 'postIdWas', get(this, 'post.id'));
      set(this, 'comments', []);
      if (get(this, 'post.topLevelCommentsCount') > 0) {
        get(this, 'getComments').perform().then((comments) => {
          const content = comments.toArray().reverse();
          set(content, 'links', get(comments, 'links'));
          set(this, 'comments', content);
        }).catch(() => {});
      }
    }
  },

  onPagination(records) {
    set(this, 'isLoading', false);
    unshiftObjects(get(this, 'comments'), records.toArray().reverse());
    invokeAction(this, 'trackEngagement', 'click');
  },

  actions: {
    onPagination() {
      set(this, 'isLoading', true);
      this._super(null, { page: { limit: 10, offset: get(this, 'comments.length') } });
    },

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
      // if we're on the permalink page then redirect after deletion
      if (get(this, 'comment')) {
        get(this, 'router').transitionTo('posts', [get(this, 'post.id')]);
      } else {
        get(this, 'comments').removeObject(comment);
        invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
      }
    },

    trackEngagement(...args) {
      invokeAction(this, 'trackEngagement', ...args);
    }
  }
});
