import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';

export default Component.extend({
  intl: service(),
  notify: service(),
  actionsTaskGroup: taskGroup(),

  removeMemberTask: task(function* () {
    yield get(this, 'member').destroyRecord().catch(() => {
      get(this, 'notify').error(get(this, 'intl').t('errors.request'));
    });
  }).group('actionsTaskGroup')
});
