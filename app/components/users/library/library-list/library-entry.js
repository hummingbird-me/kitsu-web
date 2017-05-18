import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { scheduleOnce } from 'ember-runloop';
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

  willDestroyElement() {
    this._super(...arguments);
    this._removeClickHandler();
  },

  saveTask: task(function* (useTimeout = false) {
    // Yield a timeout giving the user a chance to click the increment button
    // more than once in a short period but only send one save event.
    if (useTimeout) {
      yield timeout(1000);
    }
    const changeset = get(this, 'changeset');
    yield changeset.validate();
    if (get(changeset, 'isValid') && get(changeset, 'isDirty')) {
      yield invokeAction(this, 'saveEntry', changeset);
    }
  }).restartable(),

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    },

    showInput() {
      set(this, 'showProgressEditor', true);
      scheduleOnce('afterRender', () => {
        this._setupClickHandler();
      });
    },

    incrementProgress() {
      this.incrementProperty('changeset.progress', 1);
      get(this, 'saveTask').perform(true);
    },

    changeRating(rating) {
      set(this, 'changeset.rating', rating);
      get(this, 'saveTask').perform();
    },

    checkedEntry(value) {
      const libraryEntry = get(this, 'libraryEntry');
      invokeAction(this, 'checkedEntry', libraryEntry, value);
    }
  },

  /**
   * Setup a click event handler on the body to remove the progress input and save the
   * changeset.
   *
   * @private
   */
  _setupClickHandler() {
    this.progressInputHandler = ({ target }) => {
      const isProgressInput = target.matches('.library-progress-input *, .library-progress-input');
      if (!isProgressInput) {
        set(this, 'showProgressEditor', false);
        this._removeClickHandler();
        get(this, 'saveTask').perform();
      }
    };
    document.body.addEventListener('click', this.progressInputHandler);
  },

  _removeClickHandler() {
    if (this.progressInputHandler) {
      document.body.removeEventListener('click', this.progressInputHandler);
      this.progressInputHandler = null;
    }
  }
});
