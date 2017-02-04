import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  tagName: 'section',
  classNames: ['media--related'],

  relationships: computed('media.mediaRelationships', function() {
    const results = {};
    const mediaRelationships = get(this, 'media.mediaRelationships');
    mediaRelationships.forEach((relationship) => {
      const role = get(relationship, 'role');
      results[role] = results[role] || [];
      results[role].addObject(get(relationship, 'destination'));
    });
    // sort the results by key
    return this._sortResults(results);
  }).readOnly(),

  _sortResults(results) {
    const sortedKeys = Object.keys(results).sort();
    const sortedResults = {};
    sortedKeys.forEach((key) => {
      sortedResults[key] = get(results, key).sort((a, b) => {
        const aStart = get(a, 'startDate');
        const bStart = get(b, 'startDate');
        if (aStart && bStart) {
          if (aStart.isBefore(bStart)) {
            return -1;
          } else if (aStart.isAfter(bStart)) {
            return 1;
          }
        }
        return 0;
      });
    });
    return sortedResults;
  }
});
