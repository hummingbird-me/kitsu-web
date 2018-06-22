import Component from 'client/components/explore/category-sidebar/category-modal/category-item';
import { get, computed } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNameBindings: ['category.childCount:has-children:no-children'],

  isActive: computed('selection.[]', function() {
    return (get(this, 'selection') || []).includes(get(this, 'category.slug'));
  }).readOnly(),

  click({ target }) {
    if (!get(this, 'isChild')) { return false; }

    // The SVG is replaced upon click, so it won't exist in the DOM anymore
    const element = get(this, 'element');
    if (!element.contains(target)) { return false; }

    const isExpandBtn = element.matches('.category-expand-btn');
    if (!isExpandBtn) {
      invokeAction(this, 'updateCategories', get(this, 'category.slug'));
    }
    return false; // don't bubble up
  }
});
