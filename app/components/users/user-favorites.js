import Component from '@ember/component';
import { get, computed } from '@ember/object';

const favoriteComputed = (...args) => {
  const type = args.pop();
  return computed(...args, function() {
    const records = get(this, 'user.favorites') || [];
    return records.filter(record => (
      get(record, 'item.modelType') === type
    )).rejectBy('isDeleted').sortBy('favRank').toArray();
  }).readOnly();
};

export default Component.extend({
  classNames: ['user-favorites'],
  /**
   * Number of entries to show before the fold
   */
  animeCount: 8,
  mangaCount: 8,
  characterCount: 8,

  animeFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'anime'),
  mangaFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'manga'),
  characterFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'character')
});
