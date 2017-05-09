import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { CanMixin } from 'ember-can';
import Pagination from 'kitsu-shared/mixins/pagination';

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

  model() {
    const model = this.modelFor('groups.group.dashboard');
    return {
      taskInstance: this.queryPaginated('feed', {
        type: 'reports_aggr',
        id: get(model, 'group.id'),
        include: 'subject.user,subject.naughty,subject.moderator'
      }),
      paginatedRecords: []
    };
  },

  titleToken() {
    const model = this.modelFor('groups.group.dashboard');
    const group = get(model, 'group.name');
    return get(this, 'intl').t('titles.groups.group.dashboard.reports', { group });
  },

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
