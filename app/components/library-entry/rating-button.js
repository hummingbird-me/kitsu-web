import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import HoverIntentMixin from 'client/mixins/hover-intent';

export default Component.extend(HoverIntentMixin, {
  classNames: ['rating-button'],
  tagName: 'button',
  rating: 1,
  hoverTimeout: 500,
  hoverOnly: true,

  click() {
    if (!get(this, 'hoverOnly')) {
      invokeAction(this, 'onClick');
    }
  },

  actions: {
    ratingSelected(rating) {
      invokeAction(this, 'onClick', rating);
    }
  }
});
