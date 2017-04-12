import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import groupBy from 'ember-group-by';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

export default Component.extend({
  datedLogs: computed('export.libraryEntryLogs', function() {
    const logs = get(this, 'export.libraryEntryLogs');
    logs.forEach((log) => {
      const created = get(log, 'createdAt');
      set(log, 'date', created.format(dateFormat));
    });
    return logs;
  }).readOnly(),
  logsByDate: groupBy('datedLogs', 'date'),
  sortedLogs: computed('logsByDate', function() {
    const dates = get(this, 'logsByDate');
    const sDates = dates.sort((a, b) => {
      const ad = moment(get(a, 'value'), dateFormat);
      const bd = moment(get(b, 'value'), dateFormat);
      return bd.diff(ad);
    });
    sDates.forEach((date) => {
      const logs = get(date, 'items');
      const sLogs = logs.sort((a, b) => get(b, 'createdAt').diff(get(a, 'createdAt')));
      set(date, 'items', sLogs);
      const d = moment(get(date, 'value'), dateFormat);
      set(date, 'value', d.format('MMMM Do YYYY'));
    });
    return sDates;
  }).readOnly(),

  actions: {
    removeExport(exp) {
      exp.destroyRecord();
    }
  }
});
