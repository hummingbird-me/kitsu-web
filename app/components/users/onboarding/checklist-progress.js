import Component from 'ember-component';
import computed, { alias, gte } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import observer from 'ember-metal/observer';
import { isObject } from 'client/helpers/is-object';

const isObjectComputed = property => (
  computed(property, {
    get() {
      return isObject([get(this, property)]);
    }
  }).readOnly()
);

export default Component.extend({
  classNameBindings: ['isCompleted'],

  metrics: service(),
  hasRatings: gte('user.ratingsCount', 5),
  hasAvatar: isObjectComputed('user.avatar'),
  hasCover: isObjectComputed('user.coverImage'),
  hasAbout: alias('user.about'),
  hasFavorites: gte('user.favoritesCount', 1),

  isCompleted: computed('hasRatings', 'hasAvatar', 'hasCover', 'hasAbout', 'hasFavorites', {
    get() {
      return get(this, 'hasRatings') === true && get(this, 'hasAvatar') === true &&
        get(this, 'hasCover') === true &&
        (get(this, 'hasAbout') !== undefined || get(this, 'hasAbout') !== null) &&
        get(this, 'hasFavorites') === true;
    }
  }).readOnly(),

  ratingsLeft: computed('user.ratingsCount', {
    get() {
      return 5 - get(this, 'user.ratingsCount');
    }
  }).readOnly(),

  _track: observer('isCompleted', function() {
    if (get(this, 'isCompleted') === true) {
      get(this, 'metrics').trackEvent({ category: 'onboarding', action: 'complete', label: 'users' });
    }
  })
});
