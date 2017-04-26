import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task, timeout } from 'ember-concurrency';
import computed from 'ember-computed';
import groupBy from 'ember-group-by';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export default Component.extend({
  store: service(),
  logsByDate: groupBy('datedLogs', 'date'),

  datedLogs: computed('account.libraryEntryLogs', function() {
    const logs = get(this, 'account.libraryEntryLogs');
    logs.forEach((log) => {
      const created = get(log, 'createdAt');
      set(log, 'date', created.format(DATE_FORMAT));
    });
    return logs;
  }).readOnly(),

  sortedLogs: computed('logsByDate', function() {
    const dates = get(this, 'logsByDate');
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

  init() {
    this._super(...arguments);
    get(this, 'pollingTask').perform();
  },

  pollingTask: task(function* () {
    while (true) {
      const account = get(this, 'account');
      yield get(this, 'store').query('library-entry-log', {
        include: 'media',
        filter: { linkedAccountId: get(account, 'id') },
        fields: { media: ['canonicalTitle', 'titles', 'posterImage', 'slug'].join(',') }
      }).then((logs) => {
        set(this, 'account.libraryEntryLogs', logs);
        const pending = logs.any(log => get(log, 'syncStatus') === 'pending');
        if (!pending) {
          this._cancelPollingTask();
        }
      });
      yield timeout(5000);
    }
  }).drop(),

  _cancelPollingTask() {
    get(this, 'pollingTask').cancelAll();
  }
});
