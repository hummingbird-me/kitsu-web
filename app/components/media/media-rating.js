import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { decimalNumber } from 'client/helpers/decimal-number';

const THRESHOLD = 10;

export default Component.extend({
  hasCommunityRatings: computed('media.ratingFrequencies', {
    get() {
      const ratingFrequencies = get(this, 'media.ratingFrequencies');
      const ratingCount = Object.keys(ratingFrequencies).reduce((prev, curr) => {
        if (curr === null || (parseFloat(curr) % 0.5) !== 0) return prev;
        return prev + parseInt(ratingFrequencies[curr], 10);
      }, 0);
      return ratingCount > THRESHOLD;
    }
  }).readOnly(),

  totalRatings: computed('media.ratingFrequencies', {
    get() {
      return get(this, 'media.totalRatings').toLocaleString();
    }
  }).readOnly(),

  totalFavorites: computed('media.favoritesCount', function() {
    return get(this, 'media.favoritesCount').toLocaleString();
  }).readOnly(),

  percentageClass: computed('media.ratingFrequencies', {
    get() {
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
    }
  }).readOnly(),

  _calculatePercentage() {
    const freqs = get(this, 'media.ratingFrequencies');
    const keys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(k => k.toString());
    const total = get(this, 'media.totalRatings');
    const liked = keys.slice(7).reduce((prev, curr) => (
      prev + (parseInt(freqs[decimalNumber([curr])], 10) || 0)
    ), 0);
    const value = total === 0 ? 0 : (liked / total) * 100;
    return value.toFixed(0);
  }
});
