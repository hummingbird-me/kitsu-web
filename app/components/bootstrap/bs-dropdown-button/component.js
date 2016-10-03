import ButtonComponent from 'client/components/bootstrap/bs-button/component';

export default ButtonComponent.extend({
  attributeBindings: ['aria-haspopup', 'aria-expanded', 'data-toggle'],
  classNames: ['dropdown-toggle'],
  'aria-haspopup': 'true',
  'aria-expanded': 'false',
  'data-toggle': 'dropdown'
});
