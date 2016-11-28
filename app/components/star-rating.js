import StarRatingComponent from 'ember-star-rating/components/star-rating';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { modelType } from 'client/helpers/model-type';

export default StarRatingComponent.extend({
  session: service(),

  click() {
    get(this, 'session.account').incrementProperty('ratingsCount');
    this._super(...arguments);
  }
});
