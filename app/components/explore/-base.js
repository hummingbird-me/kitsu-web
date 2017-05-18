import Component from 'ember-component';
import service from 'ember-service/inject';

export default Component.extend({
  classNames: ['explore-section'],
  store: service(),
  limit: 5,
});
