import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.sortingOptions = [
      'watched', // Oldest
      'rating', // Lowest
      'title', // A - Z
      'length', // Shortest
      'started', // Latest
      'finished', // Latest
      'added' // Latest
    ];
  },

  actions: {
    toggleSortDirection() {
      const direction = get(this, 'direction');
      set(this, 'direction', direction === 'desc' ? 'asc' : 'desc');
    }
  }
});
