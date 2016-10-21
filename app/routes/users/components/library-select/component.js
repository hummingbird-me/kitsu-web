import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-secondary'],
  classNameBindings: ['isActive:active'],

  click() {
    if (get(this, 'isActive')) {
      return;
    }
    const status = get(this, 'status');
    invokeAction(this, 'onClick', status);
  }
});
