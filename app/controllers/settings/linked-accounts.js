import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';

export default Controller.extend({
  facebook: service(),
  facebookTasks: taskGroup().drop(),

  connectFacebook: task(function* () {
    yield get(this, 'facebook').connect(get(this, 'session.account')).catch(() => {
      get(this, 'session.account').rollbackAttributes();
    });
  }).group('facebookTasks'),

  disconnectFacebook: task(function* () {
    yield get(this, 'facebook').disconnect(get(this, 'session.account')).catch(() => {
      get(this, 'session.account').rollbackAttributes();
    });
  }).group('facebookTasks'),
});
