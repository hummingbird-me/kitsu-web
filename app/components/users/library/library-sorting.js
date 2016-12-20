import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  init() {
    this._super(...arguments);
    this._resetActiveSort();
  },

  _updateActiveSort(type) {
    const active = get(this, 'active');
    if (get(active, 'type') === type) {
      // same type, toggle direction
      if (get(active, 'direction') === 'desc') {
        set(active, 'direction', 'asc');
      } else if (get(active, 'direction') === 'asc') {
        this._resetActiveSort();
      }
    } else {
      set(this, 'active', { type, direction: 'desc' });
    }
  },

  _resetActiveSort() {
    set(this, 'active', {});
  },

  actions: {
    sort(type) {
      this._updateActiveSort(type);
      invokeAction(this, 'onSortChange', get(this, 'active'));
    }
  }
});
