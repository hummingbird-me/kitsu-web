import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import HoverIntentMixin from 'client/mixins/hover-intent';

export default Component.extend(HoverIntentMixin, {
  hoverTimeout: 0,

  mediaYear: computed('media.startDate', function() {
    return get(this, 'media.startDate').year();
  }).readOnly(),

  yearlessTitle: computed('media.computedTitle', function() {
    const title = get(this, 'media.computedTitle');
    const match = title.match(/\(\d{4}\)/);
    if (match) {
      return title.slice(0, match.index) + title.slice(match.index + 6);
    }
    return title;
  }).readOnly(),

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
