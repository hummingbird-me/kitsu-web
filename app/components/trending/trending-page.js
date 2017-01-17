import Component from 'ember-component';
import service from 'ember-service/inject';

export default Component.extend({
  classNames: ['trending-page'],
  session: service()
});
