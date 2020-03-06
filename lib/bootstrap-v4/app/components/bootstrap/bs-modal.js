import Component from '@ember/component';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

export default Component.extend({
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex', 'aria-hidden', 'backdrop:data-backdrop', 'keyboard:data-keyboard'],
  ariaRole: 'dialog',
  tabindex: '-1',
  'aria-hidden': 'true',
  backdrop: 'true',
  keyboard: 'true',

  didInsertElement() {
    this.$().modal('show');
    this.$().off('hidden.bs.modal').on('hidden.bs.modal', event => {
      invokeAction(this, 'onClose', event);
    });
  },

  willDestroyElement() {
    this.$().off('hidden.bs.modal');
    jQuery('.modal-backdrop').remove();
    jQuery('body').removeClass('modal-open');
  }
});
