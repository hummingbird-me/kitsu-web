import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'regularRating', get(this, 'rating') / 2 || 0.5);
  },

  actions: {
    onClick(rating) {
      invokeAction(this, 'onClick', rating * 2);
    }
  }
});
