import Component from 'ember-component';
import computed, { gte } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import observer from 'ember-metal/observer';

export default Component.extend({
  metrics: service(),

  hasRatings: gte('user.ratingsCount', 5),
  hasFollows: gte('user.followingCount', 5),
  hasComments: gte('user.commentsCount', 1),
  hasLikes: gte('user.likesGivenCount', 3),

  isCompleted: computed('hasRatings', 'hasFollows', 'hasComments', 'hasLikes', {
    get() {
      return get(this, 'hasRatings') === true && get(this, 'hasFollows') === true &&
        get(this, 'hasComments') === true && get(this, 'hasLikes') === true;
    }
  }).readOnly(),

  ratingsLeft: computed('user.ratingsCount', {
    get() {
      return 5 - get(this, 'user.ratingsCount');
    }
  }).readOnly(),

  followsLeft: computed('user.followingCount', {
    get() {
      return 5 - get(this, 'user.followingCount');
    }
  }).readOnly(),

  likesLeft: computed('user.likesGivenCount', {
    get() {
      return 3 - get(this, 'user.likesGivenCount');
    }
  }).readOnly(),

  _track: observer('isCompleted', function() {
    if (get(this, 'isCompleted') === true) {
      get(this, 'metrics').trackEvent({ category: 'onboarding', action: 'complete', label: 'dashboard' });
    }
  })
});
