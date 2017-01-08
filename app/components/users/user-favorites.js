import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { modelType } from 'client/helpers/model-type';

const favoriteComputed = (...args) => {
  const type = args.pop();
  return computed(...args, {
    get() {
      const records = get(this, 'user.favorites') || [];
      return records.filter(record => (
        modelType([get(record, 'item')]) === type
      )).rejectBy('isDeleted').toArray();
    }
  }).readOnly();
};

export default Component.extend({
  /**
   * Number of entries to show before the fold
   */
  animeCount: 8,
  mangaCount: 8,
  characterCount: 12,

  animeFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'anime'),
  mangaFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'manga'),
  characterFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'character')
});
