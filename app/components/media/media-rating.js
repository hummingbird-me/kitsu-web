import Component from 'ember-component';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import { decimalNumber } from 'client/helpers/decimal-number';

const THRESHOLD = 10;

export default Component.extend({
  session: service(),

  hasCommunityRatings: computed('media.ratingFrequencies', {
    get() {
      const ratingFrequencies = get(this, 'media.ratingFrequencies');
      const ratingCount = Object.keys(ratingFrequencies).reduce((prev, curr) => {
        if (curr === null || (curr % 0.5) !== 0) return prev;
        return prev + parseInt(ratingFrequencies[curr]);
      }, 0);

      return ratingCount > THRESHOLD;
    }
  }).readOnly(),

  percentageLiked: computed('media.ratingFrequencies', {
    get() {
      const freqs = get(this, 'media.ratingFrequencies');
      // TODO: There are some weird keys on the server from our april fools joke -- so hardcoded.
      const keys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(k => k.toString());
      const total = keys.reduce((prev, curr) => (
        prev + (parseInt(freqs[decimalNumber([curr])], 10) || 0)
      ), 0);
      const liked = keys.slice(7).reduce((prev, curr) => (
        prev + (parseInt(freqs[decimalNumber([curr])], 10) || 0)
      ), 0);
      const value = total === 0 ? 0 : (liked / total) * 100;
      return `${value.toFixed(0)}%`;
    }
  }).readOnly(),

  actions: {
    update(rating) {
      invokeAction(this, 'update', rating);
    }
  }
});
