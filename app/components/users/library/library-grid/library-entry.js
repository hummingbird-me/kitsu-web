import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  tagName: '',

  progressPercent: computed('libraryEntry.progress', function() {
    const progress = get(this, 'libraryEntry.progress');
    const unitCount = get(this, 'libraryEntry.media.unitCount');
    if (!progress || !unitCount) { return htmlSafe('width: 0%;'); }
    return htmlSafe(`width: ${(progress * 100) / unitCount}%;`);
  }).readOnly()
});
