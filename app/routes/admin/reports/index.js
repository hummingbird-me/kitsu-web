import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  modelTask: task(function* () {
    return yield get(this, 'store').query('report', {
      include: 'user,naughty,moderator',
      filter: { status: 0 },
      page: { limit: 20 }
    }).then((results) => {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'taskValue', results);
      return results;
    });
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  }
});
