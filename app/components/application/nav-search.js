import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import jQuery from 'jquery';

export default Component.extend({
  isOpened: false,
  query: undefined,

  inputClass: computed('isOpened', 'query', function() {
    const isActive = get(this, 'isOpened') || isPresent(get(this, 'query'));
    return `site-search__input ${isActive ? 'active' : ''}`;
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    jQuery(document.body).on('click.nav-search', (event) => {
      const target = get(event, 'target');
      const id = `#${get(this, 'elementId')}`;
      const isChild = jQuery(target).is(`${id} *, ${id}`);
      const isPopover = jQuery(target).is('.navbar-search-results *, .navbar-search-results');
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
