import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  modelTask: task(function* () {
    const results = yield get(this, 'store').findAll('linked-account');
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  },

  actions: {
    removeExport(exporter) {
      exporter.destroyRecord();
    }
  }
});
