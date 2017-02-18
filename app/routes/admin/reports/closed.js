import Route from 'ember-route';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Route.extend(InfinitePagination, {
  model() {
    return {
      taskInstance: get(this, 'queryClosedReportsTask').perform(),
      paginatedElements: []
    };
  },

  queryClosedReportsTask: task(function* () {
    return yield get(this, 'store').query('report', {
      include: 'user,naughty,moderator',
      filter: { status: '1,2' },
      page: { offset: 0, limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  })
});
