import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';
/* global Clipboard */

export default Mixin.create({
  didInsertElement() {
    this._super(...arguments);
    const id = get(this, 'elementId');
    set(this, 'clipboard', new Clipboard(`#${id} [data-clipboard-text]`));
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'clipboard') !== undefined) {
      get(this, 'clipboard').destroy();
    }
  }
});
