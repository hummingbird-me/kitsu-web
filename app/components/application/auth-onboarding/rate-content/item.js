import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    onClick(rating) {
      invokeAction(this, 'onClick', rating);
    }
  }
});
