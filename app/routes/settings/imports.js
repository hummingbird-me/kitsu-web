import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { task } from 'ember-concurrency';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  model() {
    return {
      taskInstance: get(this, 'getImportsTask').perform(),
      paginatedRecords: []
    };
  },

  getImportsTask: task(function* () {
    return yield this.queryPaginated('list-import', {
      filter: { user_id: get(this, 'session.account.id') }
    }).then(records => {
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
