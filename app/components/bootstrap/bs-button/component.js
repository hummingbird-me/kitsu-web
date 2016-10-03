import Component from 'ember-component';

export default Component.extend({
  tagName: 'button',
  ariaRole: 'button',
  attributeBindings: ['disabled', 'data-test-selector'],
  classNames: ['btn'],
  classNameBindings: ['type'],
  type: 'btn-primary'
});
