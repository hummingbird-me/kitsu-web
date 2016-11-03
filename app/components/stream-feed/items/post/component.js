import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  classNameBindings: ['post.isNew:new-post'],
  classNames: ['stream-item', 'row'],
  isHidden: false,

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

  _streamAnalytics(label, verb, object) {
    const content = object || {
      foreign_id: `Post:${get(this, 'post.id')}`,
      actor: {
        id: `User:${get(this, 'session.account.id')}`,
        label: get(this, 'session.account.name')
      },
      verb: verb || label,
      object: { id: `Post:${get(this, 'post.id')}` }
    };
    const data = {
      label,
      content,
      position: get(this, 'positionInFeed') || 0
    };
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
    const post = get(this, 'post');
    set(this, 'isHidden', get(post, 'nsfw') === true || get(post, 'spoiler') === true);
  },

  actions: {
    trackShare() {
      this._streamAnalytics('click', 'share');
    },

    trackStream(label, verb, content) {
      this._streamAnalytics(label, verb, content);
    },

    blockUser() {
      const block = get(this, 'store').createRecord('block', {
        user: get(this, 'session.account'),
        blocked: get(this, 'post.user')
      });
      // TODO: Feedback
      block.save().then(() => {}).catch(() => {});
    }
  }
});
