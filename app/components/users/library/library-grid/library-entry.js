import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  tagName: '',

  progressPercent: computed('libraryEntry.progress', function() {
    const progress = get(this, 'libraryEntry.progress');
    const unitCount = get(this, 'libraryEntry.media.unitCount');
    if (!progress || !unitCount) { return 0; }
    return (progress * 100) / unitCount;
  }).readOnly()
});
