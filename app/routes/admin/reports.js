import Route from 'ember-route';
import DataErrorMixin from 'client/mixins/routes/data-error';
import jQuery from 'jquery';

export default Route.extend(DataErrorMixin, {
  titleToken: 'Reports',

  activate() {
    this._super(...arguments);
    jQuery('body').addClass('settings-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('settings-page');
  },
});
