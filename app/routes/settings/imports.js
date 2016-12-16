import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';

export default Route.extend({
  modelTask: task(function* () {
    return yield get(this, 'store').findAll('list-import').then((results) => {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'taskValue', results);
      return results;
    });
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
