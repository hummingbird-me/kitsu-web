import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, gt } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';

export default Component.extend({
  showExtraReports: false,
  intl: service(),
  notify: service(),

  hasMoreReports: gt('report.activities.length', 1),
  subject: alias('report.activities.firstObject.subject'),

  others: computed('report.activities.[]', function() {
    return get(this, 'report.activities').slice(1);
  }).readOnly(),

  doWorkTask: task(function* (cb) {
    return yield cb().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).drop(),

  actions: {
    closeReport(status = 'declined') {
      set(this, 'subject.status', status);
      set(this, 'subject.moderator', get(this, 'session.account'));
      get(this, 'doWorkTask').perform(() => (
        get(this, 'subject.content').save().catch(() => {
          get(this, 'subject.content').rollbackAttributes();
        })
      ));
    },

    removeContent() {
      get(this, 'doWorkTask').perform(() => (
        get(this, 'subject.naughty.content').destroyRecord()
      )).then(() => {
        invoke(this, 'closeReport', 'resolved');
      }).catch(() => {});
    },

    escalateReport() {
      invoke(this, 'closeReport', 'escalated');
    }
  },
});
