import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { unshiftObjects } from 'client/utils/array-utils';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  classNames: ['stream-item-comments'],
  sortOptions: ['likes', 'replies', 'oldest'],
  upload: undefined,
  metrics: service(),
  notify: service(),
  store: service(),
  router: service(),

  getComments: task(function* () {
    return yield this.queryPaginated('comment', {
      filter: { post_id: get(this, 'post.id'), parent_id: '_none' },
      fields: { users: ['avatar', 'name', 'slug'].join(',') },
      page: { limit: 2 },
      include: 'user,uploads',
      sort: this._getSortOption()
    }, { cache: false });
  }).drop(),

  createComment: task(function* (content, embedUrl = undefined) {
    const data = {
      content,
      embedUrl,
      post: get(this, 'post'),
      user: get(this, 'session.account'),
    };
    const upload = get(this, 'upload');
    if (upload) {
      data.uploads = [upload];
    }
    const comment = get(this, 'store').createRecord('comment', data);
    get(this, 'comments').addObject(comment);

    // update comments count
    invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') + 1);
    get(this, 'session.account').incrementProperty('commentsCount');
    yield comment.save().then(() => {
      invokeAction(this, 'trackEngagement', 'comment');
      get(this, 'metrics').trackEvent({ category: 'comment', action: 'create', value: get(this, 'post.id') });
    }).catch(err => {
      get(this, 'comments').removeObject(comment);
      invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
      get(this, 'session.account').decrementProperty('commentsCount');
      get(this, 'notify').error(errorMessages(err));
    });
  }).drop(),

  init() {
    this._super(...arguments);
    set(this, 'comments', []);
    set(this, 'sort', get(this, 'commentSort') || 'recent');
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
      set(this, 'comments', []);
      if (get(this, 'post.topLevelCommentsCount') > 0) {
        this._getComments();
      }
    }
  },

  onPagination(records) {
    set(this, 'isLoading', false);
    const content = records.toArray();
    if (get(this, 'isModalView')) {
      get(this, 'comments').addObjects(content);
    } else {
      unshiftObjects(get(this, 'comments'), content.reverse());
    }
    invokeAction(this, 'trackEngagement', 'click');
  },

  actions: {
    onPagination() {
      set(this, 'isLoading', true);
      return this._super(null, { page: { limit: 20, offset: get(this, 'comments.length') } });
    },

    updateSort(sort) {
      set(this, 'sort', sort);
      this._getComments();
    },

    deletedComment(comment) {
      // if we're on the permalink page then redirect after deletion
      if (get(this, 'comment')) {
        get(this, 'router').transitionTo('posts', get(this, 'post'));
      } else {
        get(this, 'comments').removeObject(comment);
        invokeAction(this, 'countUpdate', get(this, 'post.topLevelCommentsCount') - 1);
      }
    },

    trackEngagement(...args) {
      invokeAction(this, 'trackEngagement', ...args);
    }
  },

  _getComments() {
    get(this, 'getComments').perform().then(comments => {
      let content = comments.toArray();
      if (!get(this, 'isModalView')) {
        content = content.reverse();
      }
      set(content, 'links', get(comments, 'links'));
      set(this, 'comments', content);
    }).catch(() => {});
  },

  _getSortOption() {
    const sort = get(this, 'sort');
    switch (sort) {
      case 'likes': return '-likesCount,createdAt';
      case 'replies': return '-repliesCount,createdAt';
      case 'oldest': return 'createdAt';
      default: return '-createdAt';
    }
  }
});
