import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  tagName: 'section',
  classNames: ['media--related'],

  relationships: computed('media.mediaRelationships', {
    get() {
      const results = {};
      const mediaRelationships = get(this, 'media.mediaRelationships');
      mediaRelationships.forEach((relationship) => {
        const role = get(relationship, 'role');
        results[role] = results[role] || [];
        results[role].addObject(get(relationship, 'destination'));
      });
      // sort the results by key
      const sortedKeys = Object.keys(results).sort();
      const sortedResults = {};
      sortedKeys.forEach((key) => {
        sortedResults[key] = get(results, key);
      });
      return sortedResults;
    }
  }).readOnly()
});
