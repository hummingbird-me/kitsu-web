import Component from '@ember/component';
import { get, set } from '@ember/object';
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
