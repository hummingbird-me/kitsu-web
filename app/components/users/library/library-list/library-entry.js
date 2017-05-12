import Component from 'ember-component';
import get from 'ember-metal/get';
import createChangeset from 'ember-changeset-cp-validations';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',
  isChecked: false,

  init() {
    this._super(...arguments);
    this.changeset = createChangeset(get(this, 'libraryEntry'));
  },

  saveTask: task(function* () {
    // Yield a timeout giving the user a chance to click the increment button
    // more than once in a short period but only send one save event.
    yield timeout(500);
    yield invokeAction(this, 'saveEntry', get(this, 'changeset'));
  }).restartable(),

  actions: {
    incrementProgress() {
      this.incrementProperty('changeset.progress', 1);
      get(this, 'saveTask').perform();
    },

    checkedEntry(value) {
      const libraryEntry = get(this, 'libraryEntry');
      invokeAction(this, 'checkedEntry', libraryEntry, value);
    }
  }
});
