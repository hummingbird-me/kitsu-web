import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import matches from 'client/utils/elements-match';

export default Component.extend({
  isOpened: false,
  query: undefined,
  searchEventListener: undefined,
  closeSearchEventListener: undefined,

  inputClass: computed('isOpened', 'query', function() {
    const isActive = get(this, 'isOpened') || isPresent(get(this, 'query'));
    return `site-search__input ${isActive ? 'active' : ''}`;
  }).readOnly(),

  _searchEventListener(event) {
    if (this.isDestroyed) return;
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
  },

  // Close search results when the user clicks outside of the input or results window
  _closeSearchEventListener(event) {
    if (this.isDestroyed) return;
    const searchResults = document.getElementsByClassName('navbar-search-results')[0];
    const isClickInInput = this.element && this.element.contains(event.target);
    const isClickInResults = searchResults && searchResults.contains(event.target);
    if (!isClickInInput && !isClickInResults) set(this, 'isOpened', false);
  },

  didInsertElement() {
    this._super(...arguments);
    set(this, 'searchEventListener', this._searchEventListener.bind(this));
    set(this, 'closeSearchEventListener', this._closeSearchEventListener.bind(this));
    this.element.addEventListener('focusin', get(this, 'searchEventListener'));
    document.addEventListener('click', get(this, 'closeSearchEventListener'));
  },

  willDestroyElement() {
    this.element.removeEventListener('focusin', get(this, 'searchEventListener'));
    document.removeEventListener('click', get(this, 'closeSearchEventListener'));
  },

  actions: {
    close() {
      set(this, 'isOpened', false);
      console.log(get(this, 'isOpened'));
    }
  }
});
