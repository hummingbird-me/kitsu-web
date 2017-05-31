import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { reads, sort } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  queryCache: service(),
  categories: reads('getCategoriesTask.last.value'),

  titleSorting: ['title'],
  sortedCategories: sort('categories', 'titleSorting'),

  init() {
    this._super(...arguments);
    get(this, 'getCategoriesTask').perform();
  },

  getCategoriesTask: task(function* () {
    return yield get(this, 'queryCache').query('category', {
      filter: { parent_id: '_none' },
      fields: { category: 'title' },
      page: { limit: 500 } // Get all parents
    });
  }).drop()
});
