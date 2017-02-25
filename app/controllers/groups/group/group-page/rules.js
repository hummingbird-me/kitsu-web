import Controller from 'ember-controller';
import { alias } from 'ember-computed';

export default Controller.extend({
  group: alias('model')
});
