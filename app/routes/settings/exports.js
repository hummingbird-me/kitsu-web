import Route from 'ember-route';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Route.extend({
  model() {
    return {
      taskInstance: get(this, 'modelTask').perform()
    };
  },

  modelTask: task(function* () {
    return yield get(this, 'store').query('linked-account', {
      include: 'libraryEntryLogs.media',
      fields: {
        media: [
          'canonicalTitle',
          'posterImage',
          'slug'
        ].join(',')
      }
    }).then(records => get(records, 'firstObject'));
  }),

  hasExporterForMal: computed(function() {
    return !!get(this, 'store').peekAll('linked-account').findBy('kind', 'my-anime-list');
  }).readOnly(),

  actions: {
    removeExport(exporter) {
      exporter.destroyRecord()
        .then(() => this.refresh())
        .catch((err) => {
          get(this, 'notify').error(errorMessages(err));
          get(this, 'raven').captureException(err);
        });
    },

    refresh() {
      this.refresh();
    }
  }
});
