import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import { mediaType } from 'client/helpers/media-type';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';

export default Component.extend({
  session: service(),
  store: service(),

  // Search media and filter out records that are already favorites of the user
  search: task(function* (type, value) {
    yield timeout(100);
    const field = 'text';
    return yield get(this, 'store').query(type, {
      filter: { [field]: value },
      page: { limit: 3 }
    }).then(records => records.reject(record => (
      get(this, `${type}Favorites`).map(item => get(item, 'item.id')).includes(get(record, 'id'))
    )));
  }).restartable(),

  getFavorites: task(function* (type) {
    return yield get(this, 'store').query('favorite', {
      filter: {
        user_id: get(this, 'user.id'),
        item_type: type
      },
      include: 'item',
      sort: 'fav_rank'
    });
  }).drop().maxConcurrency(3),

  getAllFavorites: task(function* () {
    const anime = get(this, 'getFavorites').perform('Anime');
    const manga = get(this, 'getFavorites').perform('Manga');
    return yield RSVP.allSettled([anime, manga], 'Get Favorites');
  }).drop().cancelOn('willDestroyElement'),

  init() {
    this._super(...arguments);
    get(this, 'getAllFavorites').perform().then(([anime, manga]) => {
      set(this, 'animeFavorites', get(anime, 'value'));
      set(this, 'mangaFavorites', get(manga, 'value'));

      // add to meta records to check for dirty state
      get(anime, 'value').forEach(record => invokeAction(this, 'addRecord', record));
      get(manga, 'value').forEach(record => invokeAction(this, 'addRecord', record));
    }).catch(() => {});
  },

  actions: {
    reorderItems(type, items) {
      set(this, `${type}Favorites`, items);
      items.forEach(item => set(item, 'favRank', items.indexOf(item) + 1));
    },

    addItem(item) {
      const record = get(this, 'store').createRecord('favorite', {
        user: get(this, 'user'),
        item
      });
      // TODO: Feedback
      const type = mediaType([item]);
      record.save().then(() => {
        get(this, `${type}Favorites`).addObject(record);
        invokeAction(this, 'addRecord', record);
        // Increase count on user
        get(this, 'session.account').incrementProperty('favoritesCount');
      }).catch(() => {});
    },

    removeItem(item) {
      // TODO: Feedback
      const type = mediaType([get(item, 'item')]);
      item.destroyRecord().then(() => {
        const items = get(this, `${type}Favorites`);
        items.removeObject(item);
        items.forEach(record => set(record, 'favRank', items.indexOf(record) + 1));
        invokeAction(this, 'removeRecord', item);
      }).catch(() => {});
    },

    updateNextPage(type, records, links) {
      const content = get(this, `${type}Favorites`).toArray();
      content.addObjects(records);
      set(this, `${type}Favorites`, content);
      set(this, `${type}Favorites.links`, links);
    }
  }
});
