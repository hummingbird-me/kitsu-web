import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';

export default Component.extend({
  store: service(),

  hasExporterForMal: getter(function() {
    return this.hasExporterFor('MyAnimeList');
  }),

  hasExporterFor() {
    const exporter = get(this, 'store').peekAll('linked-account').filterBy('kind', 'my-anime-list');
    return get(exporter, 'length') !== 0;
  },

  actions: {
    changeComponent(component, siteName) {
      invokeAction(this, 'changeComponent', component, { ...get(this, 'componentData'), siteName });
    }
  }
});
