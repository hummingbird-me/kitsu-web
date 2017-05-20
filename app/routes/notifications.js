import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(AuthenticatedRouteMixin, Pagination, {
  authenticationRoute: 'dashboard',
  queryCache: service(),

  model() {
    return {
      taskInstance: this.queryPaginated('feed', {
        type: 'notifications',
        id: get(this, 'session.account.id'),
        include: 'actor,target.post',
        page: { limit: 30 }
      }, { cache: false }),
      paginatedRecords: []
    };
  },

  actions: {
    onPagination() {
      return this._super('feed', {
        type: 'notifications',
        id: get(this, 'session.account.id')
      });
    }
  }
});
