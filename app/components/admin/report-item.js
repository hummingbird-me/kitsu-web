import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, taskGroup } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'tr',
  notify: service(),
  reportTask: taskGroup().drop(),

  updateReport: task(function* (status) {
    const report = get(this, 'report');
    set(report, 'status', status);
    set(report, 'moderator', get(this, 'session.account'));
    yield report.save()
      .then(() => get(this, 'notify').success(`Report was marked as ${status}.`))
      .catch(err => {
        report.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
  }).drop(),

  actions: {
    changeStatus(status) {
      get(this, 'updateReport').perform(status);
    }
  }
});
