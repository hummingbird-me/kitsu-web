import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';
/* global ClipboardJS */

export default Mixin.create({
  didInsertElement() {
    this._super(...arguments);
    const id = get(this, 'elementId');
    set(this, 'clipboard', new ClipboardJS(`#${id} [data-clipboard-text]`));
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'clipboard') !== undefined) {
      get(this, 'clipboard').destroy();
    }
  }
});
