import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import groupBy from 'ember-group-by';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'client/mixins/pagination';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export default Component.extend(Pagination, {
  exportLogs: concat('getExportLogsTask.last.value', 'paginatedRecords'),
  groupedExportLogs: groupBy('exportLogs', 'formattedDate'),

  /**
   * Take the grouped logs which are in a format of:
   *   [{ property: 'formattedDate', value: 'YYYY-MM-DD', items: [...] }, ...]
   * Sort the list by the value property, then sort the items of each element
   * by their createdAt property.
   */
  sortedLogs: computed('groupedExportLogs', function() {
    const dates = get(this, 'groupedExportLogs');
    const sortedDates = dates.sort((a, b) => {
      const ad = moment(get(a, 'value'), DATE_FORMAT);
      const bd = moment(get(b, 'value'), DATE_FORMAT);
      return bd.diff(ad);
    });

    sortedDates.forEach((date) => {
      const logs = get(date, 'items');
      const sortedLogs = logs.sort((a, b) => (
        get(b, 'createdAt').diff(get(a, 'createdAt'))
      ));
      set(date, 'items', sortedLogs);
      const d = moment(get(date, 'value'), DATE_FORMAT);
      set(date, 'value', d.format('MMMM Do YYYY'));
    });
    return sortedDates;
  }).readOnly(),

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
  }).keepLatest()
});
