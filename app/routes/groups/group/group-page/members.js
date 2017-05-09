import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  intl: service(),

  model() {
    const model = this.modelFor('groups.group.group-page');
    return {
      taskInstance: this.queryPaginated('group-member', {
        include: 'user',
        filter: { query_group: get(model, 'group.id') },
        fields: { users: ['avatar', 'coverImage', 'name'].join(',') },
        page: { limit: 20 }
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('groups.group.group-page');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.group-page.members', { group });
  },
});
