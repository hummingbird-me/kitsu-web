import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import computed from 'ember-computed';
import { typeOf } from 'ember-utils';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import getter from 'client/utils/getter';
import ClipboardMixin from 'client/mixins/clipboard';
import InViewportMixin from 'ember-in-viewport';
import errorMessages from 'client/utils/error-messages';
import moment from 'moment';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend(ClipboardMixin, InViewportMixin, {
  classNameBindings: ['post.isNew:new-post'],
  classNames: ['stream-item', 'row'],
  isHidden: false,

  notify: service(),
  router: service('-routing'),
  session: service(),
  store: service(),
  metrics: service(),
  host: getter(() => `${location.protocol}//${location.host}`),

  activity: getter(function() {
    return get(this, 'group.activities.lastObject');
  }),

  tweetLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'posts', get(this, 'post.id'));
    const url = `${host}${link}`;
    const text = encodeURIComponent('Check out this post on #kitsu');
    return `https://twitter.com/share?text=${text}&url=${url}`;
  }),

  facebookLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'posts', get(this, 'post.id'));
    const url = `${host}${link}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }),

  isEditable: getter(function() {
    if (get(this, 'session.account').hasRole('admin', get(this, 'post'))) {
      return true;
    }
    const time = moment(get(this, 'post.createdAt')).add(30, 'minutes');
    return !time.isBefore();
  }),

  postEdited: computed('post.createdAt', 'post.updatedAt', {
    get() {
      return moment(get(this, 'post.createdAt')).isSame(get(this, 'post.updatedAt')) === false;
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
    const post = get(this, 'post');
    set(this, 'isHidden', get(post, 'nsfw') || get(post, 'spoiler'));
  },

  _updateHidden: observer('post.nsfw', 'post.spoiler', function() {
    const post = get(this, 'post');
    set(this, 'isHidden', get(post, 'nsfw') || get(post, 'spoiler'));
  }),

  actions: {
    trackEngagement(label, id) {
      const foreignId = typeOf(id) === 'string' ? id : undefined;
      this._streamAnalytics(label, foreignId || `Post:${get(this, 'post.id')}`);
    },

    deletePost() {
      get(this, 'post').destroyRecord()
        .then(() => {
          // this post is being deleted from its permalink page
          if (get(this, 'group') === undefined) {
            get(this, 'router').transitionTo('dashboard');
          } else {
            // try to find the activity-group that references this post
            let record = get(this, 'store').peekRecord('activity-group', get(this, 'group.id'));
            // might be a new activity-group that doesn't have a set id
            if (record === null || record === undefined) {
              record = get(this, 'store').peekAll('activity-group')
                .find(group => get(group, 'activities').findBy('foreignId', `Post:${get(this, 'post.id')}`));
            }
            invokeAction(this, 'removePost', record);
          }
          get(this, 'notify').success('Success! Your post has been deleted.');
        })
        .catch((err) => {
          get(this, 'post').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    pinOrUnpinPost (post = null) {
      const user = get(this, 'session.account');
      set(user, 'pinnedPost', post);
      user.save();
    }
  }
});
