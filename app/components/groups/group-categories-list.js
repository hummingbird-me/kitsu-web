import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  classNames: ['group-categories'],
  store: service(),
  currentCategory: 'all',
  categories: concat('allCategories', 'getCategoriesTask.last.value'),

  filteredCategories: computed('categories', function() {
    const hideNsfw = get(this, 'session.account.sfwFilter');
    const categories = get(this, 'categories');
    const nsfwCategory = categories.findBy('slug', 'nsfw');
    return hideNsfw ? categories.without(nsfwCategory) : categories;
  }).readOnly(),

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
