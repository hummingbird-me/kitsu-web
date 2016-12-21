import Component from 'ember-component';
import computed, { alias, gte } from 'ember-computed';
import get from 'ember-metal/get';
import { isObject } from 'client/helpers/is-object';

const isObjectComputed = property => (
  computed(property, {
    get() {
      return isObject([get(this, property)]);
    }
  }).readOnly()
);

export default Component.extend({
  hasRatings: gte('user.ratingsCount', 5),
  hasAvatar: isObjectComputed('user.avatar'),
  hasCover: isObjectComputed('user.coverImage'),
  hasAbout: alias('user.about'),
  hasFavorites: gte('user.favoritesCount', 1),

  ratingsLeft: computed('user.ratingsCount', {
    get() {
      return 5 - get(this, 'user.ratingsCount');
    }
  }).readOnly()
});
