import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  authenticationRoute: 'dashboard',
  ajax: service(),

  model() {
    return get(this, 'ajax').request('/sso/canny');
  },

  afterModel() {
    return this.transitionTo('feedback.bugs');
  }
});
