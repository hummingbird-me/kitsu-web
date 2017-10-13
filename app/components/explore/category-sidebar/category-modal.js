import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads, sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  router: service('-routing'),
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
  }).drop(),

  actions: {
    handleTransition(slug) {
      this.$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('explore.category', [slug]);
      }).modal('hide');
    }
  }
});
