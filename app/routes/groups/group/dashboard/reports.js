import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { CanMixin } from 'ember-can';
import Pagination from 'client/mixins/pagination';

export default Route.extend(CanMixin, Pagination, {
  queryParams: {
    filter: { refreshModel: true, replace: true }
  },
  intl: service(),

  beforeModel() {
    const model = this.modelFor('groups.group.dashboard');
    const membership = get(model, 'membership');
    if (!this.can('manage reports for group', { membership })) {
      return this.transitionTo('groups.group.dashboard.index');
    }
  },

  model(params) {
    return {
      taskInstance: get(this, 'getReportsTask').perform(params),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('groups.group.dashboard');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.reports', { group });
  },

  getReportsTask: task(function* () {
    const model = this.modelFor('groups.group.dashboard');
    return yield get(this, 'store').query('feed', {
      type: 'reports_aggr',
      id: get(model, 'group.id'),
      include: 'subject.user,subject.naughty,subject.moderator'
    }).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  _getRealStatus(filter) {
    switch (filter) {
      case 'open':
        return 'reported';
      case 'resolved':
        return 'resolved';
      default:
        return undefined;
    }
  }
});
