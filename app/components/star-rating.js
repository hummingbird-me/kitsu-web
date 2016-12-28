import StarRatingComponent from 'ember-star-rating/components/star-rating';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';

export default StarRatingComponent.extend({
  session: service(),

  click() {
    get(this, 'session.account').incrementProperty('ratingsCount');
    this._super(...arguments);
  },

  /**
   * Override `_update` from `ember-star-rating` to support setting rating to `null`
   * if the value is the same.
   */
  _update(event) {
    if (get(this, 'readOnly')) {
      return;
    }
    const pageX = event.pageX;
    const target = this._getTarget(pageX);
    let rating = Math.floor(target * 2) / 2;
    if (rating === get(this, 'rating')) {
      rating = null;
    }
    invokeAction(this, 'onClick', rating);
  },
});
