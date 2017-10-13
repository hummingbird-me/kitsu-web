import Component from '@ember/component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: 'label',
  classNames: ['field-wrapper'],

  mouseEnter() {
    invokeAction(this, 'onHover');
  }
});
