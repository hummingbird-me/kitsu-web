import Component from 'ember-component';

export default Component.extend({
  tagName: 'button',
  ariaRole: 'button',
  attributeBindings: ['disabled'],
  classNames: ['button'],
  classNameBindings: ['type'],
  type: 'button--primary'
});
