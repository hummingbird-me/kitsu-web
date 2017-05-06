import Component from 'ember-component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.sortingOptions = [
      '-watched', // Recent
      'watched', // Oldest
      '-rating', // Highest
      'rating', // Lowest
      'title', // A - Z
      '-title', // Z - A
      'length', // Shortest
      '-length' // Longest
    ];
  }
});
