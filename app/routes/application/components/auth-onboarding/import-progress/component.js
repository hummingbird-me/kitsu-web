import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    changeComponent(component, ...args) {
      invokeAction(this, 'changeComponent', component, ...args);
    }
  }
});
