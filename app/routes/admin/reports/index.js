import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  model() {
    return {
      taskInstance: get(this, 'queryOpenedReportsTask').perform()
    };
  },

  queryOpenedReportsTask: task(function* () {
    return yield get(this, 'store').query('report', {
      include: 'user,naughty,moderator',
      filter: { status: 0 },
      page: { limit: 20 }
    });
  })
});
