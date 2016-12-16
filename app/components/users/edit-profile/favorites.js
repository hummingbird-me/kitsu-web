import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import { modelType } from 'client/helpers/model-type';
import { createArrayWithLinks } from 'client/utils/array-utils';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';

export default Component.extend({
  notify: service(),
  session: service(),
  store: service(),

  // Search media and filter out records that are already favorites of the user
  search: task(function* (type, value) {
    yield timeout(250);
    let field = 'text';
    if (type === 'character') {
      field = 'name';
    }
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
    const chars = get(this, 'getFavorites').perform('Character');
    return yield RSVP.allSettled([anime, manga, chars], 'Get Favorites');
  }).drop().cancelOn('willDestroyElement'),

  init() {
    this._super(...arguments);
    get(this, 'getAllFavorites').perform().then(([anime, manga, chars]) => {
      set(this, 'animeFavorites', createArrayWithLinks(get(anime, 'value')));
      set(this, 'mangaFavorites', createArrayWithLinks(get(manga, 'value')));
      set(this, 'characterFavorites', createArrayWithLinks(get(chars, 'value')));

      // add to meta records to check for dirty state
      get(anime, 'value').forEach(record => invokeAction(this, 'addRecord', record));
      get(manga, 'value').forEach(record => invokeAction(this, 'addRecord', record));
      get(chars, 'value').forEach(record => invokeAction(this, 'addRecord', record));
    }).catch(() => {});
  },

  actions: {
    reorderItems(type, items) {
      set(this, `${type}Favorites`, items);
      items.forEach(item => set(item, 'favRank', items.indexOf(item) + 1));
    },

    addItem(item) {
      const type = modelType([item]);
      const record = get(this, 'store').createRecord('favorite', {
        user: get(this, 'user'),
        item
      });

      get(this, `${type}Favorites`).addObject(record);
      invokeAction(this, 'addRecord', record);
      get(this, 'session.account').incrementProperty('favoritesCount');
    },

    removeItem(item) {
      const type = modelType([get(item, 'item')]);
      const items = get(this, `${type}Favorites`);
      item.deleteRecord();
      items.removeObject(item);
      items.forEach(record => set(record, 'favRank', items.indexOf(record) + 1));
    },

    updateNextPage(type, records, links) {
      const content = get(this, `${type}Favorites`).toArray();
      content.addObjects(records);
      set(this, `${type}Favorites`, content);
      set(this, `${type}Favorites.links`, links);
      records.forEach(record => invokeAction(this, 'addRecord', record));
    }
  }
});
