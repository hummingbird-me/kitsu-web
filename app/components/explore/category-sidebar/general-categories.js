import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { reads } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  queryCache: service(),
  userCategories: reads('getUserFavoritesTask.last.value'),
  categories: reads('getCategoriesTask.last.value'),

  init() {
    this._super(...arguments);
    if (get(this, 'session.hasUser')) {
      get(this, 'getUserFavoritesTask').perform();
    }
    get(this, 'getCategoriesTask').perform();
  },

  getUserFavoritesTask: task(function* () {
    return yield get(this, 'queryCache').query('category-favorite', {
      include: 'category',
      filter: { user_id: get(this, 'session.account.id') },
      fields: { category: 'title,slug' },
      page: { limit: 20 }
    });
  }).drop(),

  getCategoriesTask: task(function* () {
    return yield get(this, 'queryCache').query('category', {
      sort: '-total_media_count',
      page: { limit: 40 }
    });
  }).drop()
});
