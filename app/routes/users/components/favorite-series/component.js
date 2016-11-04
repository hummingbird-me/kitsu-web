import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Component.extend({
  store: service(),

  getFavorites: task(function* (type) {
    return yield get(this, 'store').query('favorite', {
      filter: {
        user_id: get(this, 'user.id'),
        item_type: type
      },
      include: 'item',
      sort: 'fav_rank',
      page: { limit: 4 }
    });
  }).drop().maxConcurrency(3),

  getAllFavorites: task(function* () {
    const anime = get(this, 'getFavorites').perform('Anime');
    const manga = get(this, 'getFavorites').perform('Manga');
    const chars = get(this, 'getFavorites').perform('Character');
    return yield RSVP.allSettled([anime, manga, chars], 'Get Favorites');
  }).drop(),

  init() {
    this._super(...arguments);
    get(this, 'getAllFavorites').perform().then(([anime, manga, chars]) => {
      set(this, 'animeFavorites', get(anime, 'value'));
      set(this, 'mangaFavorites', get(manga, 'value'));
      set(this, 'characterFavorites', get(chars, 'value'));
    });
  },

  actions: {
    updateNextPage(type, records, links) {
      const content = get(this, `${type}Favorites`).toArray();
      content.addObjects(records);
      set(this, `${type}Favorites`, content);
      set(this, `${type}Favorites.links`, links);
    }
  }
});
