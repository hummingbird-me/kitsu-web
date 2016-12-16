import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  session: service(),

  modelTask: task(function* () {
    return yield get(this, 'store').findAll('block', { include: 'blocked' }).then((results) => {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'taskValue', results);
      return results;
    });
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
