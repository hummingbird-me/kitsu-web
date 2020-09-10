import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import matches from 'client/utils/elements-match';

export default Component.extend({
  isOpened: false,
  query: undefined,

  inputClass: computed('isOpened', 'query', function() {
    const isActive = get(this, 'isOpened') || isPresent(get(this, 'query'));
    return `site-search__input ${isActive ? 'active' : ''}`;
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    this.element.addEventListener('focusin', event => {
      const target = get(event, 'target');
      const id = `#${get(this, 'elementId')}`;
      const isChild = matches(target, `${id} *, ${id}`);
      const isPopover = matches(target, '.navbar-search-results *, .navbar-search-results');
      if (isChild || isPopover) {
        if (isChild) {
          if (!get(this, 'isOpened')) {
            set(this, 'isOpened', true);
          }
        }
        return;
      }
      set(this, 'isOpened', false);
    });

    // Close search results when the user clicks outside of the input or results window
    document.addEventListener('click', event => {
      const searchResults = document.getElementsByClassName('navbar-search-results')[0];
      const isClickInInput = this.element.contains(event.target);
      const isClickInResults = searchResults && searchResults.contains(event.target);

      if (!isClickInInput && !isClickInResults) set(this, 'isOpened', false);
    });
  },

  willDestroyElement() {
    this.element.removeEventListener('focusin');
    document.removeEventListener('click');
  },

  actions: {
    close() {
      set(this, 'isOpened', false);
      console.log(get(this, 'isOpened'));
    }
  }
});
