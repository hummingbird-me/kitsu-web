import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(AuthenticatedRouteMixin, DataErrorMixin, {
  session: service(),

  model() {
    return get(this, 'store').query('list-import', {
      filter: { user_id: get(this, 'session.account.id') }
    });
  }
});
