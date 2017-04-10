import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import HoverIntentMixin from 'client/mixins/hover-intent';

export default Component.extend(HoverIntentMixin, {
  /** Determines what class to use based on the percentage value. */
  percentageClass: computed('media.averageRating', function() {
    if (!get(this, 'media.averageRating')) {
      return '';
    }
    const rating = get(this, 'media.averageRating');
    if (rating <= 25) {
      return 'percent-quarter-1';
    } else if (rating <= 50) {
      return 'percent-quarter-2';
    } else if (rating <= 75) {
      return 'percent-quarter-3';
    } else if (rating <= 100) {
      return 'percent-quarter-4';
    }
  }).readOnly()
});
