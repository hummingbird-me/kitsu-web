import Component from 'ember-component';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';

export default Component.extend(Pagination, {
  exportLogs: concat('getExportLogsTask.last.value', 'paginatedRecords'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getExportLogsTask').perform();
  },

  getExportLogsTask: task(function* () {
    const logs = yield this.queryPaginated('library-entry-log', {
      include: 'media',
      filter: { linked_account_id: get(this, 'account.id') },
      fields: { media: ['canonicalTitle', 'titles', 'posterImage', 'slug'].join(',') },
      page: { limit: 20 },
      sort: '-created_at'
    });
    const hasPendingLog = logs.any(log => get(log, 'syncStatus') === 'pending');
    if (hasPendingLog) {
      get(this, 'pollForChangesTask').perform();
    }
    return logs;
  }).keepLatest(),

  actions: {
    sortLogs(first, second) {
      return get(second, 'createdAt').diff(get(first, 'createdAt'));
    }
  }
});
