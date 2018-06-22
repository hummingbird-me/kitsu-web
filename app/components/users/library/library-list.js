import Component from '@ember/component';
import { get, set } from '@ember/object';
import { gt } from '@ember/object/computed';
import { invokeAction, invoke } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',
  hasSelectedMedia: gt('selectedLibraryEntries.length', 0),

  init() {
    this._super(...arguments);
    set(this, 'selectedLibraryEntries', []);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'media') !== get(this, 'mediaWas')) {
      set(this, 'selectedLibraryEntries', []);
    }
    set(this, 'mediaWas', get(this, 'media'));
  },

  actions: {
    selectEntry(libraryEntry, value) {
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

    removeEntriesBulk(...args) {
      return invokeAction(this, 'removeEntriesBulk', ...args).then(() => {
        if (!get(this, 'isDestroyed')) {
          invoke(this, 'resetSelection');
        }
      });
    },

    updateStatusBulk(...args) {
      return invokeAction(this, 'updateStatusBulk', ...args).then(() => {
        if (!get(this, 'isDestroyed')) {
          invoke(this, 'resetSelection');
        }
      });
    }
  }
});
