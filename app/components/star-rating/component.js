import Component from 'ember-star-rating/components/star-rating';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  session: service(),

  click() {
    get(this, 'session.account').incrementProperty('ratingsCount');
    this._super(...arguments);
  }
});
