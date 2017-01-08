import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import { modelType } from 'client/helpers/model-type';
import RSVP from 'rsvp';

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
  characterFavorites: favoriteComputed('user.favorites.@each.isDeleted', 'character'),

  /**
   * Retrieves the favorites of the passed in `user` and loads their associated items as well.
   */
  getFavorites: task(function* () {
    return yield get(this, 'user').hasMany('favorites').load().then(records => (
      RSVP.all(records.map(record => record.belongsTo('item').load())).then(() => records)
    ));
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getFavorites').perform();
  },
});
