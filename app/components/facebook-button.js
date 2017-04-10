import Component from 'ember-component';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: 'button',
  classNames: ['button', 'button--facebook'],
  attributeBindings: ['text:title', 'text:aria-label', 'disabled'],

  click() {
    strictInvokeAction(this, 'onclick');
  }
});
