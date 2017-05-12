import Component from 'ember-component';
import computed, { notEmpty, gte } from 'ember-computed';
import get from 'ember-metal/get';
import { isObject } from 'client/helpers/is-object';

const isObjectComputed = property => (
  computed(property, function() {
    return isObject([get(this, property)]);
  }).readOnly()
);

export default Component.extend({
  hasRatings: gte('user.ratingsCount', 5),
  hasAvatar: isObjectComputed('user.avatar'),
  hasCover: isObjectComputed('user.coverImage'),
  hasAbout: notEmpty('user.about'),
  hasFavorites: gte('user.favoritesCount', 1),

  stepsCompleted: computed('hasRatings', 'hasAvatar', 'hasCover', 'hasAbout', 'hasFavorites', function() {
    const steps = [
      get(this, 'hasRatings'),
      get(this, 'hasAvatar'),
      get(this, 'hasCover'),
      get(this, 'hasAbout'),
      get(this, 'hasFavorites')
    ];
    return 5 - steps.sort().lastIndexOf(false);
  }).readOnly(),

  percentageComplete: computed('stepsCompleted', function() {
    return 100 - (16.66 * get(this, 'stepsCompleted'));
  }).readOnly(),

  ratingsLeft: computed('user.ratingsCount', function() {
    return 5 - get(this, 'user.ratingsCount');
  }).readOnly()
});
