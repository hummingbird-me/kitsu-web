import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { typeOf } from 'ember-utils';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import InViewportMixin from 'ember-in-viewport';
import errorMessages from 'client/utils/error-messages';

export default Component.extend(ClipboardMixin, InViewportMixin, {
  classNameBindings: ['post.isNew:new-post'],
  classNames: ['stream-item', 'row'],

  notify: service(),
  router: service('-routing'),
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

  isHidden: computed('post.nsfw', 'post.spoiler', {
    get() {
      const post = get(this, 'post');
      return get(post, 'nsfw') === true || get(post, 'spoiler') === true;
    }
  }).readOnly(),

  _streamAnalytics(label, foreignId) {
    const data = {
      label,
      content: { foreign_id: foreignId },
      position: get(this, 'positionInFeed') || 0
    };
    if (get(this, 'feedId') !== undefined) {
      data.feed_id = get(this, 'feedId');
    }
    get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
  },

  didInsertElement() {
    this._super(...arguments);
    set(this, 'viewportTolerance', {
      top: 0, bottom: 500, left: 0, right: 0
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'group') !== undefined) {
      set(this, 'post', get(this, 'activity.subject.content') || get(this, 'activity.subject'));
    }
    if (get(this, 'feedId') !== undefined) {
      set(this, 'userId', get(this, 'feedId').split(':')[1]);
    }
  },

  actions: {
    trackEngagement(label, id) {
      const foreignId = typeOf(id) === 'string' ? id : undefined;
      this._streamAnalytics(label, foreignId || `Post:${get(this, 'post.id')}`);
    },

    blockUser() {
      const block = get(this, 'store').createRecord('block', {
        user: get(this, 'session.account'),
        blocked: get(this, 'post.user')
      });
      block.save().then(() => {}).catch(err => (
        get(this, 'notify').error(errorMessages(err))
      ));
    },

    deletePost() {
      get(this, 'post').destroyRecord()
        .then(() => {
          if (get(this, 'group') === undefined) {
            get(this, 'router').transitionTo('dashboard');
          } else {
            const record = get(this, 'store').peekRecord('activity-group', get(this, 'group.id'));
            record.deleteRecord();
          }
        })
        .catch((err) => {
          get(this, 'post').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    }
  }
});
