import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'a',
  classNames: ['dropdown-item'],
  attributeBindings: ['data-test-selector'],

  click() {
    const onClick = get(this, 'onClick');
    if (onClick !== undefined) {
      onClick();
    }
  }
});
