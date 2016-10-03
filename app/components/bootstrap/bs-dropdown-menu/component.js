import Component from 'ember-component';

export default Component.extend({
  attributeBindings: ['aria-labelledby', 'data-test-selector'],
  classNames: ['dropdown-menu']
});
