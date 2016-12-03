import Controller from 'ember-controller';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Controller.extend({
  session: service(),
  reviews: computed.alias('media'),

  hasSomeRatings: computed('media.ratingFrequencies', {
    get() {
      const ratingFrequencies = get(this, 'media.ratingFrequencies');
      return (Object.keys(ratingFrequencies).length > 1);
    }
  })
});
