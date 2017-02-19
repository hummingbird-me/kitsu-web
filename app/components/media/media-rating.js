import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';

export default Component.extend({
  intl: service(),

  totalRatings: computed('media.ratingFrequencies', function() {
    return get(this, 'intl').formatNumber(get(this, 'media.totalRatings'));
  }).readOnly(),

  totalFavorites: computed('media.favoritesCount', function() {
    return get(this, 'intl').formatNumber(get(this, 'media.favoritesCount'));
  }).readOnly(),

  /** Determines what class to use based on the percentage value. */
  percentageClass: computed('media.ratingFrequencies', function() {
    if (!get(this, 'media.averageRating')) {
      return '';
    }
    const liked = this._calculatePercentage();
    if (liked <= 25) {
      return 'percent-quarter-1';
    } else if (liked <= 50) {
      return 'percent-quarter-2';
    } else if (liked <= 75) {
      return 'percent-quarter-3';
    } else if (liked <= 100) {
      return 'percent-quarter-4';
    }
  }).readOnly(),

  /**
   * Calculates the "liked" percentage of this media, by taking the ratings of 4, 4.5, and 5.
   * and calculating it against the total ratings.
   *
   * @returns {Number} Percentage value
   */
  _calculatePercentage() {
    const freqs = get(this, 'media.ratingFrequencies');
    const keys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const total = get(this, 'media.totalRatings');
    const liked = keys.slice(7).reduce((prev, curr) => {
      const decimal = curr.toFixed(1).toString();
      return prev + (parseInt(freqs[decimal], 10) || 0);
    }, 0);
    const value = total === 0 ? 0 : (liked / total) * 100;
    return value.toFixed(0);
  }
});
