import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'getGroupMembersTask').perform(),
      paginatedRecords: []
    };
  },

  getGroupMembersTask: task(function* () {
    const model = this.modelFor('groups.group.group-page');
    return yield get(this, 'store').query('group-member', {
      include: 'user',
      filter: { group: get(model, 'group.id') },
      page: { limit: 20 }
    });
  }).restartable(),

  titleToken() {
    const model = this.modelFor('groups.group.group-page');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.group-page.members', { group });
  },
});
