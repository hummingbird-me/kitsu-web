import Component from '@ember/component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    onConfirm() {
      this.$('.modal').modal('hide');
      invokeAction(this, 'onConfirm');
    }
  }
});
