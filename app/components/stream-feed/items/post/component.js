import Component from 'ember-component';
import { task } from 'ember-concurrency';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { isEmpty } from 'ember-utils';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import jQuery from 'jquery';

export default Component.extend(ClipboardMixin, {
  classNameBindings: ['post.isNew:new-post'],
  classNames: ['stream-item', 'row'],
  session: service(),
  store: service(),
  metrics: service(),
  host: getter(() => `${location.protocol}//${location.host}`),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  tweetLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'posts', get(this, 'post.id'));
    const url = `${host}${link}`;
    // TODO: i18n
    const text = encodeURIComponent('Check out this post on #kitsu');
    return `https://twitter.com/share?text=${text}&url=${url}`;
  }),

  facebookLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'posts', get(this, 'post.id'));
    const url = `${host}${link}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }),

  isLiked: computed('post.postLikes.[]', 'session.account', {
    get() {
      if (get(this, 'session.isAuthenticated') === false ||
        get(this, 'post.postLikes') === undefined) {
        return false;
      }
      const likes = get(this, 'post.postLikes');
      const user = get(this, 'session.account');
      return likes.findBy('user.id', get(user, 'id')) !== undefined;
    }
  }).readOnly(),

  toggleLike: task(function* () {
    if (get(this, 'session.isAuthenticated') === false) {
      return get(this, 'session.signUpModal')();
    }

    const user = get(this, 'session.account');
    const post = get(this, 'post');
    if (get(this, 'isLiked') === true) {
      const like = get(this, 'post.postLikes').findBy('user.id', get(user, 'id'));
      post.decrementProperty('postLikesCount');
      yield like.destroyRecord().catch(() => {
        like.rollbackAttributes();
        post.incrementProperty('postLikesCount');
      });
    } else {
      // could be attempting to like a non-saved post
      if (isEmpty(get(this, 'post.id')) === true) {
        return;
      }
      const like = get(this, 'store').createRecord('post-like', {
        post,
        user: get(this, 'session.account')
      });
      post.incrementProperty('postLikesCount');
      yield like.save()
        .then((record) => {
          this._streamAnalytics('like', { id: `PostLike:${get(record, 'id')}` });
        })
        .catch(() => {
          get(post, 'postLikes').removeObject(like);
          post.decrementProperty('postLikesCount');
        });
    }
  }).drop(),

  createComment: task(function* (content) {
    // clear value (TODO: Will eventually be compenentized)
    this.$('.add-comment').val('');
    const comment = get(this, 'store').createRecord('comment', {
      content,
      post: get(this, 'post'),
      user: get(this, 'session.account')
    });
    yield comment.save().then((record) => {
      get(this, 'post').incrementProperty('commentsCount');
      this._streamAnalytics('comment', { id: `Comment:${get(record, 'id')}` });
    }).catch(() => {
      get(this, 'post').decrementProperty('commentsCount');
      get(this, 'post.comments').removeObject(comment);
    });
  }).drop(),

  _streamAnalytics(label, verb, object) {
    if (jQuery.isPlainObject(verb) === true) {
      object = verb; // eslint-disable-line no-param-reassign
      verb = undefined; // eslint-disable-line no-param-reassign
    }
    // foreign_id is manually build as it may be a post on a `posts` page.
    const data = {
      label,
      content: {
        foreign_id: `Post:${get(this, 'post.id')}`,
        actor: {
          id: `User:${get(this, 'session.account.id')}`,
          label: get(this, 'session.account.name')
        },
        verb: verb || label
      },
      position: get(this, 'positionInFeed') || 0
    };
    if (object !== undefined) {
      data.content.object = object;
    }
    if (get(this, 'feedId') !== undefined) {
      data.feed_id = get(this, 'feedId');
    }
    get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'group') !== undefined) {
      set(this, 'post', get(this, 'activity.subject'));
    }
  },

  actions: {
    trackClick(verb) {
      this._streamAnalytics('click', verb, { id: `Post:${get(this, 'post.id')}` });
    }
  }
});
