import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce } from 'ember-runloop';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'dashboard',
  queryParams: { token: { replace: true } },

  // Remove token from URL so it can't leak if we have an external link on this page.
  setupController(controller) {
    this._super(...arguments);
    set(controller, 'usableToken', get(controller, 'token'));
    scheduleOnce('afterRender', () => set(controller, 'token', null));
  },

  resetController(controller) {
    set(controller, 'usableToken', null);
    set(controller, 'email', null);
    set(controller, 'password', null);
    set(controller, 'passwordConfirm', null);
  }
});
