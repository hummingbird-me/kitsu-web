import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import service from 'ember-service/inject';
import computed from 'ember-computed';

export default Component.extend({
  store: service(),

  hasExporterForMal: computed(function() {
    return !!get(this, 'store').peekAll('linked-account').findBy('kind', 'my-anime-list');
  }).readOnly(),

  actions: {
    changeComponent(component, siteName) {
      invokeAction(this, 'changeComponent', component, { ...get(this, 'componentData'), siteName });
    }
  }
});
