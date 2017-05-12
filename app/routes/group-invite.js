import Route from 'ember-route';
import get from 'ember-metal/get';
import DataError from 'client/mixins/routes/data-error';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(DataError, AuthenticatedRouteMixin, {
  authenticationRoute: 'dashboard',

  model({ id }) {
    return get(this, 'store').findRecord('group-invite', id, { include: 'group,sender,user' });
  },

  afterModel(model) {
    const userId = get(this, 'session.account.id');
    const inviteeId = get(model, 'user.id');
    if (userId !== inviteeId) {
      return this.transitionTo('dashboard');
    }
  }
});
