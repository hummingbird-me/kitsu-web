import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  authenticationRoute: 'dashboard',
  queryCache: service(),

  model() {
    return get(this, 'queryCache').query('feed', {
      type: 'notifications',
      id: get(this, 'session.account.id'),
      include: 'actor,target.post',
      page: { limit: 30 }
    });
  }
});
