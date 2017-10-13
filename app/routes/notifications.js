import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
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
