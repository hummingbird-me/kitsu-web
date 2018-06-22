import Component from '@ember/component';
import { set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',

  willDestroyElement() {
    this._super(...arguments);
    this._removeClickHandler();
  },

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? value : parsed;
    },

    showInput() {
      set(this, 'showProgressEditor', true);
      scheduleOnce('afterRender', () => {
        this._setupClickHandler();
      });
    },
  },

  /**
   * Setup a click event handler on the body to remove the progress input and save the
   * record.
   *
   * @private
   */
  _setupClickHandler() {
    this.progressInputHandler = ({ target }) => {
      const isProgressInput = target.matches('.library-progress-input');
      if (!isProgressInput) {
        set(this, 'showProgressEditor', false);
        this._removeClickHandler();
        invokeAction(this, 'save');
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
