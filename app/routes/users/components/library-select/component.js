import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-secondary'],
  classNameBindings: ['isActive:active'],

  click() {
    if (get(this, 'isActive')) {
      return;
    }
    const status = get(this, 'status');
    get(this, 'onClick')(status);
  }
});
