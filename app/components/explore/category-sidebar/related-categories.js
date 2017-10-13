import Component from '@ember/component';
import { get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';

export default Component.extend({
  tagName: '',
  queryCache: service(),
  categories: concat('parent', 'siblings', 'children'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getRelatedCategoriesTask').perform();
  },

  getRelatedCategoriesTask: task(function* () {
    const category = get(this, 'category');
    let parent = category.belongsTo('parent').value();
    const siblings = yield get(this, 'getChildCategoriesTask').perform(parent);
    const children = yield get(this, 'getChildCategoriesTask').perform(category);
    // Check that the parent isn't one of our title placeholders
    const parentToParent = parent.belongsTo('parent').value();
    parent = parentToParent === null ? null : [parent];
    setProperties(this, { parent, siblings, children });
  }).drop(),

  getChildCategoriesTask: task(function* (category) {
    const id = get(category, 'id');
    return yield get(this, 'queryCache').query('category', {
      filter: { parent_id: id },
      page: { limit: 50 }
    });
  }).drop()
});
