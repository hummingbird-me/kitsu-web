import Component from '@ember/component';
import { get } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    changeComponent(component, siteName) {
      invokeAction(this, 'changeComponent', component, { ...get(this, 'componentData'), siteName });
    }
  }
});
