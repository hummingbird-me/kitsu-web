import Route from 'ember-route';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';

export default Route.extend({
  model() {
    return {
      taskInstance: get(this, 'modelTask').perform()
    };
  },

  modelTask: task(function* () {
    return yield get(this, 'store').query('linked-account', {
      include: 'libraryEntryLogs.media',
      fields: { media: 'canonicalTitle' }
    });
  }),

  hasExporterForMal: computed(function() {
    return !!get(this, 'store').peekAll('linked-account').findBy('kind', 'my-anime-list');
  }).readOnly(),

  actions: {
    removeExport(exporter) {
      exporter.destroyRecord();
    }
  }
});
