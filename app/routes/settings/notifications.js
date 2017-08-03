import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';

export default Route.extend({
  model() {
    return { taskInstance: get(this, 'getNotificationSettingsTask').perform() };
  },

  getNotificationSettingsTask: task(function* () {
    return yield get(this, 'store').query('notification-setting', {
      filter: { userId: get(this, 'session.account.id') }
    });
  }).drop()
});
