import Component from '@ember/component';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  exportLogs: concat('getExportLogsTask.last.value', 'paginatedRecords'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getExportLogsTask').perform();
  },

  getExportLogsTask: task(function* () {
    return yield this.queryPaginated('library-entry-log', {
      include: 'media',
      filter: { linked_account_id: get(this, 'account.id') },
      fields: { media: ['canonicalTitle', 'titles', 'posterImage', 'slug'].join(',') },
      page: { limit: 20 },
      sort: '-created_at'
    });
  }).keepLatest(),

  actions: {
    sortLogs(first, second) {
      return get(second, 'createdAt').diff(get(first, 'createdAt'));
    }
  }
});
