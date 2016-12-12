import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'table',
  classNames: ['table', 'table-hover', 'table-sm'],

  filteredReports: computed('reports.@each.{naughty,status}', {
    get() {
      const reports = get(this, 'reports');
      return reports
        .rejectBy('naughty.content', null)
        .filterBy('status', get(this, 'filterStatus'));
    }
  }).readOnly()
});
