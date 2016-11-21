import OneWayFileComponent from 'ember-one-way-controls/components/one-way-file';
import { invokeAction } from 'ember-invoke-action';

export default OneWayFileComponent.extend({
  // form is hidden by default
  classNames: ['hidden-xs-up'],

  change(event) {
    invokeAction(this, 'update', event.target);
  }
});
