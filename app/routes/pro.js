import Route from '@ember/routing/route';
import DataErrorMixin from 'client/mixins/routes/data-error';
import jQuery from 'jquery';

export default Route.extend(DataErrorMixin, {
  authenticationRoute: 'dashboard',
  titleToken: 'Pro',

  activate() {
    this._super(...arguments);
    jQuery('body').addClass('pro-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('pro-page');
  }
});
