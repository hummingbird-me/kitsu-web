import Component from 'ember-component';
import service from 'ember-service/inject';
import { alias } from 'ember-computed';

export default Component.extend({
  genderOptions: ['It\'s a secret', 'Male', 'Female', 'Custom'],
  session: service(),
  user: alias('session.account')
});
