import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  modelTask: task(function* () {
    return yield get(this, 'store').findAll('list-import');
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
