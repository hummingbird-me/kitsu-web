import Component from 'client/components/explore/category-sidebar/category-modal/category-item';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNameBindings: ['category.childCount:has-children:no-children'],
  isActive: false,
  depth: 0,

  click({ target }) {
    if (!get(this, 'isChild')) { return false; }

    // The SVG is replaced upon click, so it won't exist in the DOM anymore
    const element = get(this, 'element');
    if (!element.contains(target)) { return false; }

    const isExpandBtn = element.matches('.category-expand-btn');
    if (!isExpandBtn) {
      invokeAction(this, 'updateCategories', get(this, 'category.slug'));
      return true;
    }
    return false; // don't bubble up
  }
});
