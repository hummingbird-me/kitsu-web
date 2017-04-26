import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Route.extend({
  model() {
    return { taskInstance: get(this, 'getLinkedAccountTask').perform() };
  },

  getLinkedAccountTask: task(function* () {
    return yield get(this, 'store').query('linked-account', {
      include: 'libraryEntryLogs.media',
      fields: { media: ['canonicalTitle', 'posterImage', 'slug'].join(',') }
    }).then(records => get(records, 'firstObject'));
  }).restartable(),

  actions: {
    deleteAccount(account) {
      account.destroyRecord().then(() => {
        this.refresh();
      }).catch((error) => {
        get(this, 'notify').error(errorMessages(error));
      });
    },

    refresh() {
      this.refresh();
    }
  }
});
