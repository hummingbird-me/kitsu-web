import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { hrefTo } from 'ember-href-to/helpers/href-to';
import { invokeAction } from 'ember-invoke-action';
import getter from 'client/utils/getter';
import errorMessages from 'client/utils/error-messages';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  classNames: ['stream-item', 'row'],
  metrics: service(),
  notify: service(),
  router: service(),
  store: service(),
  host: getter(() => `${window.location.protocol}//${window.location.host}`),

  tweetLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'reviews', get(this, 'review.id'));
    const title = get(this, 'media.canonicalTitle');
    const text = encodeURIComponent(`Check out this review of ${title} on #kitsu`);
    const url = `${host}${link}`;
    return `https://twitter.com/share?text=${text}&url=${url}`;
  }),

  facebookLink: getter(function() {
    const host = get(this, 'host');
    const link = hrefTo(this, 'reviews', get(this, 'review.id'));
    const url = `${host}${link}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'group') !== undefined) {
      set(this, 'review', get(this, 'activity.subject.content') || get(this, 'activity.subject'));
    }
    // media might already exist in data
    if (get(this, 'media') === undefined) {
      set(this, 'media', get(this, 'review.media'));
    }
    if (!get(this, 'session').isCurrentUser(get(this, 'review.user'))) {
      set(this, 'isHidden', get(this, 'review.spoiler'));
    }
  },

  actions: {
    trackEngagement(label) {
      const data = {
        label,
        content: { foreign_id: `Review:${get(this, 'review.id')}` },
        position: get(this, 'positionInFeed') || 0
      };
      if (get(this, 'feedId') !== undefined) {
        data.feed_id = get(this, 'feedId');
      }
      get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
    },

    deleteReview() {
      get(this, 'review').destroyRecord()
        .then(() => {
          // this post is being deleted from its permalink page
          if (get(this, 'group') === undefined) {
            get(this, 'router').transitionTo('dashboard');
          } else {
            // find the activity-group that references this review
            const record = get(this, 'store').peekRecord('activity-group', get(this, 'group.id'));
            invokeAction(this, 'removeGroup', record);
          }
          get(this, 'notify').success('Success! Your review has been deleted.');
        })
        .catch(err => {
          get(this, 'review').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    }
  }
});
