import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: 'a',
  classNames: ['dropdown-item'],
  attributeBindings: ['data-test-selector'],

  click() {
    invokeAction(this, 'onClick');
  }
});
