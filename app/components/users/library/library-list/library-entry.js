import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import createChangeset from 'ember-changeset-cp-validations';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const SAVE_TIMEOUT = 1000;

export default Component.extend({
  tagName: '',
  isChecked: false,
  readOnlyModal: false,
  showEditModal: false,

  hasReaction: computed('libraryEntry.mediaReaction', function() {
    const reaction = get(this, 'libraryEntry.mediaReaction');
    return reaction && get(reaction, 'isNew') === false;
  }),

  init() {
    this._super(...arguments);
    this.changeset = createChangeset(get(this, 'libraryEntry'));
  },

  saveTask: task(function* (useTimeout = false) {
    // Yield a timeout giving the user a chance to click the increment button
    // more than once in a short period but only send one save event.
    if (useTimeout) {
      yield timeout(SAVE_TIMEOUT);
    }
    const changeset = get(this, 'changeset');
    yield changeset.validate();
    if (get(changeset, 'isValid') && get(changeset, 'isDirty')) {
      try {
        yield invokeAction(this, 'saveEntry', changeset);
      } catch (error) {
        changeset.rollback();
        get(this, 'libraryEntry').rollbackAttributes();
      }
    }
  }).restartable(),

  actions: {
    incrementProgress(attribute = 'progress') {
      this.incrementProperty(`changeset.${attribute}`, 1);
      get(this, 'saveTask').perform(true);
    },

    changeRating(rating) {
      set(this, 'changeset.rating', rating);
      get(this, 'saveTask').perform();
    },

    checkedEntry(value) {
      const libraryEntry = get(this, 'libraryEntry');
      invokeAction(this, 'checkedEntry', libraryEntry, value);
    },

    saveEntry(changeset) {
      const newChangeset = this.changeset.merge(changeset);
      set(this, 'changeset', newChangeset);
      return get(this, 'saveTask').perform();
    }
  }
});
