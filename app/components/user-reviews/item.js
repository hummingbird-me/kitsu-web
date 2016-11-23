import Ember from 'ember';
import { invokeAction } from 'ember-invoke-action';

export default Ember.Component.extend({
  actions: {
    updateEntry(...args) {
      invokeAction(this, 'updateEntry', ...args);
    }
  }
});
