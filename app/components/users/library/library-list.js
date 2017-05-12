import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { gt } from 'ember-computed';
import libraryStatus from 'client/utils/library-status';

export default Component.extend({
  tagName: '',
  hasSelectedMedia: gt('selectedLibraryEntries.length', 0),

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'selectedLibraryEntries', []);
    set(this, 'libraryEntryStatuses', libraryStatus.getEnumKeys());
  },

  actions: {
    checkedEntry(libraryEntry, value) {
      const list = get(this, 'selectedLibraryEntries');
      if (value) {
        list.addObject(libraryEntry);
      } else {
        list.removeObject(libraryEntry);
      }
    },

    selectAll() {
      const entries = get(this, 'libraryEntries');
      get(this, 'selectedLibraryEntries').addObjects(entries);
    },

    resetSelection() {
      set(this, 'selectedLibraryEntries', []);
    },

    removeEntries() {
      const entries = get(this, 'selectedLibraryEntries');
      // @TODO(Vevix): Requires API bulk endpoint
    },

    updateStatus(status) {
      const entries = get(this, 'selectedLibraryEntries');
      // @TODO(Vevix): Requires API bulk endpoint
    }
  }
});
