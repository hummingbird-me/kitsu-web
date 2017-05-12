import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { guidFor } from 'ember-metal/utils';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

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

  didInsertElement() {
    this._super(...arguments);
    this._onBodyClick = ({ target }) => {
      const elementId = get(this, 'guid');
      const isChildElement = jQuery(target).is(`.rating-button-${elementId} *, .rating-button-${elementId}`);
      const isTetherElement = jQuery(target).is('.rating-tether *, .rating-tether');
      const isDropdownElement = jQuery(target).is('.rating-button-dropdown-menu *, .rating-button-dropdown-menu');
      if (!isChildElement && !isTetherElement && !isDropdownElement) {
        set(this, 'showTooltip', false);
      }
    };
    document.body.addEventListener('click', this._onBodyClick);
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this._onBodyClick) {
      document.body.removeEventListener('click', this._onBodyClick);
    }
  },

  actions: {
    ratingSelected(rating) {
      if (get(this, 'swapToDropdown')) {
        set(this, 'showDropdown', !!rating);
      }
      invokeAction(this, 'onClick', rating);
      set(this, 'showTooltip', false);
    }
  }
});
