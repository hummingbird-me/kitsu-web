import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  simpleTag: computed('libraryEntry.rating', function() {
    const rating = get(this, 'libraryEntry.rating');
    return this._getRatingGroup(rating);
  }).readOnly(),

  actions: {
    ratingSelected(rating) {
      set(this, 'isChangingRating', false);
      invokeAction(this, 'onRatingChange', rating);
    }
  },

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
