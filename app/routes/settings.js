import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DataErrorMixin from 'client/mixins/routes/data-error';
import jQuery from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, DataErrorMixin, {
  authenticationRoute: 'dashboard',
  titleToken: 'Settings',

  activate() {
    this._super(...arguments);
    jQuery('body').addClass('settings-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('settings-page');
  }
});
