import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import groupBy from 'ember-group-by';

export default Component.extend({
  sortedLogs: computed(function() {
    const exp = get(this, 'export');
    const logs = get(exp, 'libraryEntryLogs').sortBy('createdAt').toArray();
    logs.forEach((log) => {
      const created = get(log, 'createdAt');
      set(log, 'date', created.format('MMMM Do YYYY'));
    });
    return logs;
  }).readOnly(),
  logsByDate: groupBy('sortedLogs', 'date'),
});
