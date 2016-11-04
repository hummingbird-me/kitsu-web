import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    updateNextPage(...args) {
      invokeAction(this, 'updateNextPage', ...args);
    }
  }
});
