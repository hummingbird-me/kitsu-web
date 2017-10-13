import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { gte } from '@ember/object/computed';

export default Component.extend({
  hasRatings: gte('user.ratingsCount', 5),
  hasFollows: gte('user.followingCount', 5),
  hasComments: gte('user.commentsCount', 1),
  hasLikes: gte('user.likesGivenCount', 3),

  stepsCompleted: computed('hasRatings', 'hasFollows', 'hasComments', 'hasLikes', function() {
    const steps = [
      get(this, 'hasRatings'),
      get(this, 'hasFollows'),
      get(this, 'hasComments'),
      get(this, 'hasLikes')
    ];
    return 4 - steps.sort().lastIndexOf(false);
  }).readOnly(),

  percentageComplete: computed('stepsCompleted', function() {
    return 100 - (20 * get(this, 'stepsCompleted'));
  }).readOnly(),

  ratingsLeft: computed('user.ratingsCount', function() {
    return 5 - get(this, 'user.ratingsCount');
  }).readOnly(),

  followsLeft: computed('user.followingCount', function() {
    return 5 - get(this, 'user.followingCount');
  }).readOnly(),

  likesLeft: computed('user.likesGivenCount', function() {
    return 3 - get(this, 'user.likesGivenCount');
  }).readOnly()
});
