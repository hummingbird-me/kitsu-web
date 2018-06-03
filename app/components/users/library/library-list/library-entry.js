import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const SAVE_TIMEOUT = 1000;

export default Component.extend({
  tagName: '',
  isChecked: false,
  readOnlyModal: false,
  showEditModal: false,

  hasReaction: computed('libraryEntry.mediaReaction', function() {
    const reaction = get(this, 'libraryEntry').belongsTo('mediaReaction').value();
    return reaction && get(reaction, 'isNew') === false;
  }),

  saveTask: task(function* (useTimeout = false) {
    // Yield a timeout giving the user a chance to click the increment button
    // more than once in a short period but only send one save event.
    if (useTimeout) {
      yield timeout(SAVE_TIMEOUT);
    }

    const entry = get(this, 'libraryEntry');
    if (get(entry, 'validations.isValid') && get(entry, 'hasDirtyAttributes')) {
      try {
        yield invokeAction(this, 'saveEntry', entry);
      } catch (error) {
        entry.rollbackAttributes();
      }
    }
  }).restartable(),

  actions: {
    incrementProgress(attribute = 'progress') {
      this.incrementProperty(`libraryEntry.${attribute}`, 1);
      get(this, 'saveTask').perform(true);
    },

    changeRating(rating) {
      set(this, 'libraryEntry.rating', rating);
      get(this, 'saveTask').perform();
    },

    checkedEntry(value) {
      const libraryEntry = get(this, 'libraryEntry');
      invokeAction(this, 'checkedEntry', libraryEntry, value);
    },

    saveEntry() {
      return get(this, 'saveTask').perform();
    }
  }
});
