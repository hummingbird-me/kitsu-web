import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { reads, sort } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  queryCache: service(),
  children: reads('getChildCategoriesTask.last.value'),
  titleSorting: ['title'],
  sortedChildren: sort('children', 'titleSorting'),

  getChildCategoriesTask: task(function* () {
    const records = yield get(this, 'queryCache').query('category', {
      filter: { parent_id: get(this, 'category.id') },
      fields: { category: 'title,slug' },
      page: { limit: 50 } // Grab all of them
    });
    return records;
  }).drop(),

  actions: {
    toggleExpansion() {
      // Doesn't matter that we re-perform since we are using query-cache service.
      get(this, 'getChildCategoriesTask').perform();
      this.toggleProperty('isExpanded');
    }
  }
});
