import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import getter from 'client/utils/getter';

export default Component.extend({
  isError: getter(function() {
    return get(this, 'items') === undefined;
  }),

  actions: {
    reorderItems(...args) {
      invokeAction(this, 'reorderItems', ...args);
    },

    addItem(...args) {
      invokeAction(this, 'addItem', ...args);
    },

    removeItem(...args) {
      invokeAction(this, 'removeItem', ...args);
    },

    search(...args) {
      return invokeAction(this, 'search', ...args);
    },

    updateNextPage(...args) {
      invokeAction(this, 'updateNextPage', ...args);
    }
  }
});
