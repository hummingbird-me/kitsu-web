import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { isPresent } from 'ember-utils';
import jQuery from 'jquery';

export default Ember.Component.extend({
  isOpened: false,
  query: undefined,

  inputClass: computed('isOpened', 'query', {
    get() {
      const isActive = get(this, 'isOpened') || isPresent(get(this, 'query'));
      return `site-search__input ${isActive ? 'active' : ''}`;
    }
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    jQuery(document.body).on('click.nav-search', (event) => {
      const target = get(event, 'target');
      const id = `#${get(this, 'elementId')}`;
      const isChild = jQuery(target).is(`${id} *, ${id}`);
      const isPopover = jQuery(target).is('.search-popover *, .search-popover');
      if (isChild || isPopover) {
        if (isChild) {
          this.$('input').focus();
          if (!get(this, 'isOpened')) {
            set(this, 'isOpened', true);
          }
        }
        return;
      }
      set(this, 'isOpened', false);
    });
  },

  willDestroyElement() {
    jQuery(document.body).off('click.nav-search');
  },

  actions: {
    close() {
      set(this, 'isOpened', false);
    }
  }
});
