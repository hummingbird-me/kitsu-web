import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task, timeout } from 'ember-concurrency';
import { createArrayWithLinks } from 'client/utils/array-utils';
import { invokeAction } from 'ember-invoke-action';
import RSVP from 'rsvp';

export default Component.extend({
  initialTab: 'anime',
  notify: service(),
  session: service(),
  store: service(),

  // Search media and filter out records that are already favorites of the user
  search: task(function* (type, value) {
    yield timeout(250);
    const field = type === 'character' ? 'name' : 'text';
    return yield get(this, 'store').query(type, {
      filter: { [field]: value },
      page: { limit: 5 }
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
  }).drop(),

  init() {
    this._super(...arguments);
    // get the actual data
    get(this, 'getAllFavorites').perform().then(([anime, manga, chars]) => {
      set(this, 'animeFavorites', createArrayWithLinks(get(anime, 'value')));
      set(this, 'mangaFavorites', createArrayWithLinks(get(manga, 'value')));
      set(this, 'characterFavorites', createArrayWithLinks(get(chars, 'value')));

      // add to meta records to check for dirty state
      get(anime, 'value').forEach(record => invokeAction(this, 'addRecord', record));
      get(manga, 'value').forEach(record => invokeAction(this, 'addRecord', record));
      get(chars, 'value').forEach(record => invokeAction(this, 'addRecord', record));
    }).catch(() => {});

    // are we opening this component to a specific tab?
    const data = get(this, 'componentData');
    if (data) {
      const tab = get(data, 'tab');
      if (tab) {
        set(this, 'initialTab', tab);
      }
    }
  },

  actions: {
    reorderItems(type, items) {
      set(this, `${type}Favorites`, items);
      items.forEach(item => set(item, 'favRank', items.indexOf(item) + 1));
    },

    addItem(item) {
      const type = get(item, 'modelType');
      const record = get(this, 'store').createRecord('favorite', {
        user: get(this, 'user'),
        item
      });
      get(this, `${type}Favorites`).addObject(record);
      invokeAction(this, 'addRecord', record);
      get(this, 'session.account').incrementProperty('favoritesCount');
    },

    removeItem(item) {
      const type = get(item, 'modelType');
      const items = get(this, `${type}Favorites`);
      items.removeObject(item);
      items.forEach(record => set(record, 'favRank', items.indexOf(record) + 1));
      item.deleteRecord();
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
