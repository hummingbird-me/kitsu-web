import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { CanMixin } from 'ember-can';
import Pagination from 'client/mixins/pagination';

export default Route.extend(CanMixin, Pagination, {
  queryParams: {
    filter: { refreshModel: true, replace: true },
    query: { refreshModel: true, replace: true }
  },
  intl: service(),

  beforeModel() {
    const model = this.modelFor('groups.group.dashboard');
    const membership = get(model, 'membership');
    if (!this.can('manage tickets for group', { membership })) {
      return this.transitionTo('groups.group.dashboard.index');
    }
  },

  model(params) {
    return {
      taskInstance: get(this, 'getTicketsTask').perform(params),
      paginatedRecords: []
    };
  },

  titleToken(model) {
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.tickets', { group });
  },

  getTicketsTask: task(function* ({ filter }) {
    const model = this.modelFor('groups.group.dashboard');
    return yield get(this, 'store').query('group-ticket', {
      filter: {
        group: get(model, 'group.id'),
        status: this._getRealStatus(filter)
      },
      include: 'user,messages.user',
      page: { limit: 20 }
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  _getRealStatus(filter) {
    switch (filter) {
      case 'open':
        return 'created';
      case 'resolved':
        return 'resolved';
      default:
        return undefined;
    }
  }
});
