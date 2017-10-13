import OneWayNumber from 'ember-one-way-controls/components/one-way-number';
import { get } from '@ember/object';

export default OneWayNumber.extend({
  click() {
    get(this, 'element').select();
  }
});
