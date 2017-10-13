import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.sortingOptions = [
      'watched', // Oldest
      'started', // Oldest
      'finished', // Oldest
      'added', // Oldest
      'progress', // Least
      'rating', // Lowest
      'title', // A - Z
      'length' // Shortest
    ];
  },

  actions: {
    toggleSortDirection() {
      const direction = get(this, 'direction');
      set(this, 'direction', direction === 'desc' ? 'asc' : 'desc');
    }
  }
});
