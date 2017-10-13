import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  model() {
    return {
      taskInstance: get(this, 'queryOpenedReportsTask').perform(),
      paginatedRecords: []
    };
  },

  queryOpenedReportsTask: task(function* () {
    return yield this.queryPaginated('report', {
      include: 'user,naughty,moderator',
      filter: { status: 0 },
      page: { offset: 0, limit: 20 },
      sort: '-updatedAt'
    });
  })
});
