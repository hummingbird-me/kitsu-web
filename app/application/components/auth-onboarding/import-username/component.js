import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  init() {
    this._super(...arguments);
    set(this, 'siteName', get(this, 'componentData'));
  },

  actions: {
    changeComponent(component, ...args) {
      invokeAction(this, 'changeComponent', component, ...args);
    },

    startImport() {
      // TODO: Actual import!
      invokeAction(this, 'changeComponent', 'import-progress', get(this, 'siteName'));
    }
  }
});
