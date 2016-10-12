import Mixin from 'ember-metal/mixin';
import jQuery from 'jquery';

export default Mixin.create({
  activate() {
    this._super(...arguments);
    jQuery('body').addClass('browse-page');
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('browse-page');
  }
});
