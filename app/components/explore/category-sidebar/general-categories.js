import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  queryCache: service(),
  categories: reads('getCategoriesTask.last.value'),

  init() {
    this._super(...arguments);
    get(this, 'getCategoriesTask').perform();
  },

  getCategoriesTask: task(function* () {
    return yield get(this, 'queryCache').query('category', {
      sort: '-total_media_count',
      page: { limit: 40 }
    });
  }).drop()
});
