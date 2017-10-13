import Component from '@ember/component';
import { set } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    set(this, 'libraryEntryStatuses', LIBRARY_STATUSES);
  },

  actions: {
    removeEntriesBulk(...args) {
      set(this, 'isRemoveLoading', true);
      invokeAction(this, 'removeEntriesBulk', ...args).finally(() => {
        set(this, 'isRemoveLoading', false);
      });
    },

    updateStatusBulk(...args) {
      set(this, 'isUpdateLoading', true);
      invokeAction(this, 'updateStatusBulk', ...args).finally(() => {
        set(this, 'isUpdateLoading', false);
      });
    }
  }
});
