import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  classNames: ['group-categories'],
  store: service(),
  currentCategory: 'all',
  categories: concat('allCategories', 'getCategoriesTask.last.value'),

  init() {
    this._super(...arguments);
    set(this, 'allCategories', [{ slug: 'all', name: 'All' }]);
    get(this, 'getCategoriesTask').perform();
  },

  getCategoriesTask: task(function* () {
    return yield get(this, 'store').findAll('group-category');
  }),

  actions: {
    switchCategory(category) {
      set(this, 'currentCategory', get(category, 'slug'));
      invokeAction(this, 'onChange', get(category, 'slug'));
    }
  }
});
