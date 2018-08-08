import Component from '@ember/component';
import { get, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { invokeAction } from 'ember-invoke-action';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  swapToDropdown: false,
  showDropdown: false,
  rating: 1,

  init() {
    this._super(...arguments);
    set(this, 'guid', guidFor(this));
  },

  didReceiveAttrs() {
    this._super(...arguments);
    // Show dropdown by default if we have a rating
    if (get(this, 'swapToDropdown') && 'rating' in this.attrs) {
      set(this, 'showDropdown', !!get(this, 'rating'));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this._onBodyClick) {
      document.body.removeEventListener('click', this._onBodyClick);
    }
  },

  actions: {
    toggleTether() {
      if (!this._onBodyClick) {
        scheduleOnce('afterRender', () => {
          this._onBodyClick = ({ target }) => {
            const elementId = get(this, 'guid');
            const isChildElement = target.matches(`.rating-button-${elementId} *, .rating-button-${elementId}`);
            const isTetherElement = target.matches('.rating-tether *, .rating-tether');
            const isDropdownElement = target.matches('.rating-button-dropdown-menu *, .rating-button-dropdown-menu');
            if (!isChildElement && !isTetherElement && !isDropdownElement) {
              set(this, 'showTooltip', false);
            }
          };
          document.body.addEventListener('click', this._onBodyClick);
        });
      }
      this.toggleProperty('showTooltip');
    },

    ratingSelected(rating) {
      if (get(this, 'swapToDropdown')) {
        set(this, 'showDropdown', !!rating);
      }
      invokeAction(this, 'onClick', rating);
      set(this, 'showTooltip', false);
    }
  }
});
