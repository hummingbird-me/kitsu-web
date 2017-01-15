import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import { decimalNumber } from 'client/helpers/decimal-number';
import getter from 'client/utils/getter';

const THRESHOLD = 10;

export default Component.extend({
  session: service(),

  hasCommunityRatings: getter(function() {
    const ratingFrequencies = get(this, 'media.ratingFrequencies');
    const ratingCount = Object.keys(ratingFrequencies).reduce((prev, curr) => {
      if (curr === null || (parseFloat(curr) % 0.5) !== 0) return prev;
      return prev + parseInt(ratingFrequencies[curr], 10);
    }, 0);
    return ratingCount > THRESHOLD;
  }),

  percentageLiked: getter(function() {
    const freqs = get(this, 'media.ratingFrequencies');
    const keys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(k => k.toString());
    const total = keys.reduce((prev, curr) => (
      prev + (parseInt(freqs[decimalNumber([curr])], 10) || 0)
    ), 0);
    const liked = keys.slice(7).reduce((prev, curr) => (
      prev + (parseInt(freqs[decimalNumber([curr])], 10) || 0)
    ), 0);
    const value = total === 0 ? 0 : (liked / total) * 100;
    return value.toFixed(0);
  }),

  percentageClass: getter(function() {
    const liked = get(this, 'percentageLiked');
    if (liked <= 25) {
      return 'percent-quarter-1';
    } else if (liked <= 50) {
      return 'percent-quarter-2';
    } else if (liked <= 75) {
      return 'percent-quarter-3';
    } else if (liked <= 100) {
      return 'percent-quarter-4';
    }
  }),

  actions: {
    update(rating) {
      invokeAction(this, 'update', rating);
    }
  }
});
