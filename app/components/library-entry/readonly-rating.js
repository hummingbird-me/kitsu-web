import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  width: '20',
  height: '20',

  simpleTag: computed('rating', function() {
    const rating = get(this, 'rating');
    return this._getRatingGroup(rating);
  }).readOnly(),

  _getRatingGroup(rating) {
    if (rating > 0 && rating < 4) {
      return 'awful';
    } else if (rating >= 4 && rating < 7) {
      return 'meh';
    } else if (rating >= 7 && rating < 10) {
      return 'good';
    }
    return 'amazing';
  }
});
