import Component from 'ember-component';
import { task } from 'ember-concurrency';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  classNames: ['stream-item', 'row'],
  session: service(),
  store: service(),
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

  isLiked: computed('post.postLikes', 'session.account', {
    get() {
      if (get(this, 'session.isAuthenticated') === false) {
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
      yield like.destroyRecord().then(() => {
        post.decrementProperty('postLikesCount');
      });
    } else {
      const like = get(this, 'store').createRecord('post-like', {
        post,
        user: get(this, 'session.account')
      });
      yield like.save().then(() => {
        post.incrementProperty('postLikesCount');
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
    yield comment.save().then(() => {
      get(this, 'post').incrementProperty('commentsCount');
    });
  }).drop(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'group') !== undefined) {
      set(this, 'post', get(this, 'activity.subject'));
    }
  },

  actions: {
    /**
     * This is a hack fix so that our clipboard target anchor doesn't send
     * the user's browser to the top of the window with its `#` href.
     */
    preventDefault(event) {
      event.preventDefault();
    }
  }
});
