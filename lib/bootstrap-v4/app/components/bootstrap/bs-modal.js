import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

export default Component.extend({
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex', 'label:aria-labelledby', 'aria-hidden'],
  ariaRole: 'dialog',
  tabindex: '-1',
  'aria-hidden': 'true',
  renderInPlace: false,

  label: getter(function() {
    return `${get(this, 'id')}Label`;
  }),

  didInsertElement() {
    this.$().modal('show');
    this.$().off('hidden.bs.modal').on('hidden.bs.modal', (event) => {
      invokeAction(this, 'onClose', event);
    });
  },

  willDestroyElement() {
    this.$().off('hidden.bs.modal');
    jQuery('.modal-backdrop').remove();
    jQuery('body').removeClass('modal-open');
  }
});
