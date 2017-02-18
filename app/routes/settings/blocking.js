import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Route.extend(InfinitePagination, {
  model() {
    return {
      taskInstance: get(this, 'findBlockedUsersTask').perform(),
      paginatedElements: []
    };
  },

  findBlockedUsersTask: task(function* () {
    return yield get(this, 'store').query('block', { include: 'blocked' }).then((records) => {
      this.updatePageState(records);
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'hasNextPage', this._hasNextPage());
      return records;
    });
  }),

  onPagination() {
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'hasNextPage', this._hasNextPage());
    set(controller, 'isLoading', false);
    this._super(...arguments);
  },

  actions: {
    onPagination() {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'isLoading', true);
      this._super(...arguments);
    }
  }
});
