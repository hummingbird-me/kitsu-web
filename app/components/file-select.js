import OneWayFileComponent from 'ember-one-way-controls/components/one-way-file';
import { invokeAction } from 'ember-invoke-action';

export default OneWayFileComponent.extend({
  // form is hidden by default
  classNameBindings: ['isHidden:hidden-xs-up'],
  isHidden: true,

  change(event) {
    invokeAction(this, 'update', event.target);
  }
});
