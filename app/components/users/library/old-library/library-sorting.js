import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    this._resetActiveSort();
    const sort = get(this, 'sort');
    // We may already have a sort passed in
    if (sort !== undefined) {
      const type = sort.charAt(0) === '-' ? sort.slice(1) : sort;
      const direction = sort.charAt(0) === '-' ? 'desc' : 'asc';
      set(this, 'active', { type, direction });
    }
  },

  /**
   * Update the sorting direction of the active sort.
   */
  _updateActiveSort(type, defaultSort) {
    const active = get(this, 'active');
    // Switching the sort of an already active sort option
    if (get(active, 'type') === type) {
      const direction = get(active, 'direction');
      const newDirection = this._getOppositeSort(direction);
      if (defaultSort === newDirection || (!defaultSort && direction === 'desc')) {
        this._resetActiveSort();
      } else {
        set(active, 'direction', newDirection);
      }
    } else {
      // Initial sort option, can be specified for a type or defaults to asc.
      set(this, 'active', { type, direction: defaultSort || 'asc' });
    }
  },

  _resetActiveSort() {
    set(this, 'active', {});
  },

  _getOppositeSort(sort) {
    return sort === 'asc' ? 'desc' : 'asc';
  },

  actions: {
    sort(type, defaultSort) {
      this._updateActiveSort(type, defaultSort);
      invokeAction(this, 'onSortChange', get(this, 'active'));
    }
  }
});
