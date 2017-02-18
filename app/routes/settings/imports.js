import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';

export default Route.extend({
  modelTask: task(function* () {
    return yield get(this, 'store').findAll('list-import');
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
