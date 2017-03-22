import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

export default Component.extend({
  isChangingRating: false,

  simpleTag: computed('libraryEntry.rating', function() {
    const rating = get(this, 'libraryEntry.rating');
    return this._getRatingGroup(rating);
  }).readOnly(),

  actions: {
    showRating() {
      set(this, 'isChangingRating', true);
      // watch for clicks outside the tether element for closure
      scheduleOnce('afterRender', () => {
        jQuery(document.body).on('click.library-state-rating', ({ target }) => {
          const id = '#library-state-completed-rating';
          const isChild = jQuery(target).is(`${id} *, ${id}`);
          if (!isChild) {
            set(this, 'isChangingRating', false);
            jQuery(document.body).off('click.library-state-rating');
          }
        });
      });
    },

    ratingSelected(rating) {
      set(this, 'isChangingRating', false);
      jQuery(document.body).off('click.library-state-rating');
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
