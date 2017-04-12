import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

export default Component.extend({
  classNames: ['rating-button'],
  tagName: 'button',
  rating: 1,

  click() {
    this.toggleProperty('showTooltip');
  },

  didInsertElement() {
    this._super(...arguments);
    jQuery(document.body).on('click.rating-button', ({ target }) => {
      const elementId = get(this, 'elementId');
      const isChildElement = jQuery(target).is(`#${elementId} *, #${elementId}`);
      const isTetherElement = jQuery(target).is('.rating-tether *, .rating-tether');
      if (!isChildElement && !isTetherElement) {
        set(this, 'showTooltip', false);
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    jQuery(document.body).off('click.rating-button');
  },

  actions: {
    ratingSelected(rating) {
      invokeAction(this, 'onClick', rating);
    }
  }
});
