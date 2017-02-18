import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';

export default Route.extend({
  model() {
    return {
      taskInstance: get(this, 'findBlockedUsersTask').perform()
    };
  },

  findBlockedUsersTask: task(function* () {
    return yield get(this, 'store').findAll('block', { include: 'blocked' });
  })
});
