import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import service from 'ember-service/inject';

export default Route.extend({
  session: service(),

  modelTask: task(function* () {
    const results = yield get(this, 'store').query('linked-account', {
      user: get(this, 'session.account.id')
    });
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
