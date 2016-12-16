import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'tr',
  session: service(),
  notify: service(),
  reportTask: taskGroup().drop(),

  resolveReport: task(function* () {
    const report = get(this, 'report');
    set(report, 'status', 'resolved');
    set(report, 'moderator', get(this, 'session.account'));
    yield report.save()
      .then(() => {
        get(report, 'naughty.content').destroyRecord()
          .then(() => get(this, 'notify').success('The content has been deleted.'))
          .catch((err) => {
            get(report, 'naughty.content').rollbackAttributes();
            get(this, 'notify').error(errorMessages(err));
          });
      }).catch((err) => {
        report.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
  }).group('reportTask'),

  declineReport: task(function* () {
    const report = get(this, 'report');
    set(report, 'status', 'declined');
    set(report, 'moderator', get(this, 'session.account'));
    yield report.save().then(() => {
      get(this, 'notify').success('The report has been declined.');
    }).catch((err) => {
      report.rollbackAttributes();
      get(this, 'notify').error(errorMessages(err));
    });
  }).group('reportTask')
});
