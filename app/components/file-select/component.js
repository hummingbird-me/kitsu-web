import Component from 'ember-one-way-controls/components/one-way-file';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['hidden-xs-up'],

  change(event) {
    invokeAction(this, 'update', event.target);
  }
});
