import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  tagName: 'section',
  classNames: ['media--related'],

  featuredMedia: computed('media.relationships', function() {
    const relationships = get(this, 'media.mediaRelationships') || [];
    const media = relationships.map(relation => get(relation, 'destination'));
    return media.sort((a, b) => this._sortByDate(a, b)).slice(0, 4);
  }).readOnly(),

  _sortByDate(a, b) {
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
  }
});
