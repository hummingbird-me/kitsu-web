import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex', 'label:aria-labelledby', 'aria-hidden'],
  ariaRole: 'dialog',
  tabindex: '-1',
  'aria-hidden': 'true',
  renderInPlace: false,

  label: getter(function() {
    return `${get(this, 'id')}-label`;
  }),

  didInsertElement() {
    this.$().off('hide.bs.modal').on('hide.bs.modal', (event) => {
      invokeAction(this, 'onClose', event);
    });
  }
});
