import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  /**
   * Determines what class to use based on the percentage value.
   */
  percentageClass: computed('media.averageRating', function() {
    if (!get(this, 'media.averageRating')) {
      return '';
    }
    const rating = get(this, 'media.averageRating');
    if (rating <= 25) {
      return 'percent-quarter-1';
    }

    if (rating <= 50) {
      return 'percent-quarter-2';
    }

    if (rating <= 75) {
      return 'percent-quarter-3';
    }

    if (rating <= 100) {
      return 'percent-quarter-4';
    }
  }).readOnly()
});
