import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  model() {
    return {
      taskInstance: get(this, 'findBlockedUsersTask').perform()
    };
  },

  findBlockedUsersTask: task(function* () {
    return yield get(this, 'store').findAll('block', { include: 'blocked' });
  })
});
