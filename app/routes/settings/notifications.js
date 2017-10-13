import Route from '@ember/routing/route';
import { get } from '@ember/object';
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
