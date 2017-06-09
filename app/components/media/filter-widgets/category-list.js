import Component from 'client/components/explore/category-sidebar/category-modal';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { copy } from 'ember-metal/utils';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    const mutatableCategories = copy(get(this, 'selection'));
    set(this, 'mutatableCategories', mutatableCategories);
  },

  actions: {
    updateCategories(category) {
      const categories = get(this, 'mutatableCategories');
      if (categories.includes(category)) {
        categories.removeObject(category);
      } else {
        categories.addObject(category);
      }
      invokeAction(this, 'update', categories);
    },

    resetCategories() {
      invokeAction(this, 'update', []);
    }
  }
});
