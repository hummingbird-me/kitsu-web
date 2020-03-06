import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Route.extend({
  model() {
    return { taskInstance: get(this, 'getExporterAccount').perform() };
  },

  /**
   * Get the users linked accounts that we support as exporters.
   * Currently, that is only MyAnimeList.
   */
  getExporterAccount: task(function* () {
    return yield get(this, 'store').query('linked-account', {
      filter: { kind: 'my-anime-list' }
    }).then(records => get(records, 'firstObject'));
  }).restartable(),

  actions: {
    deleteAccount(account) {
      account.destroyRecord().then(() => {
        this.refresh();
      }).catch(error => {
        get(this, 'notify').error(errorMessages(error));
      });
    },

    refresh() {
      this.refresh();
    }
  }
});
