import Component from 'client/components/library-entry/state';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { invoke } from 'ember-invoke-action';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Component.extend({
  classNameBindings: ['libraryEntry:has-entry'],
  showHeader: false,

  isLoading: computed(
    'getLibraryEntryTask.isRunning',
    'createLibraryEntryTask.isRunning',
    'removeLibraryEntryTask.isRunning',
    'updateLibraryEntryTask.isRunning', function() {
      return get(this, 'getLibraryEntryTask.isRunning') ||
        get(this, 'createLibraryEntryTask.isRunning') ||
        get(this, 'removeLibraryEntryTask.isRunning') ||
        get(this, 'updateLibraryEntryTask.isRunning');
    }
  ).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'statuses', LIBRARY_STATUSES);
  },

  actions: {
    updateLibraryEntry(status) {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'session').signUpModal();
      }

      if (get(this, 'libraryEntry')) {
        invoke(this, 'updateAttribute', 'status', status);
      } else {
        get(this, 'createLibraryEntryTask').perform(status);
      }
    }
  },

  _getRequestOptions() {
    const options = this._super();
    delete options.include;
    return options;
  }
});
