import Component from 'ember-component';
import service from 'ember-service/inject';

export default Component.extend({
  classNames: ['stream-onboarding'],
  session: service()
});
