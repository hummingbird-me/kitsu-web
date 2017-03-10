import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  sortOptions: ['recent', 'newest', 'oldest'],

  actions: {
    updateQueryParam(property, value) {
      invokeAction(this, 'updateQueryParam', property, value);
    },

    onPagination() {
      return invokeAction(this, 'onPagination');
    }
  }
});
