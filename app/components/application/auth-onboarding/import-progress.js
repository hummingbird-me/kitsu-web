import Component from '@ember/component';
import { get, set } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData.siteName'));
  },

  actions: {
    changeComponent(component, ...args) {
      invokeAction(this, 'changeComponent', component, ...args);
    }
  }
});
