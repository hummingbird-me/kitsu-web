import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';
import HoverIntentMixin from 'client/mixins/hover-intent';

export default Component.extend(HoverIntentMixin, {
  tagName: 'button',
  hoverTimeout: 500,

  click() {
    invokeAction(this, 'onClick');
  },

  actions: {
    ratingSelected(rating) {
      invokeAction(this, 'onClick', rating);
    }
  }
});
