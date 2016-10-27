import Mixin from 'ember-metal/mixin';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
/* global Clipboard */

export default Mixin.create({
  didInsertElement() {
    this._super(...arguments);
    set(this, 'clipboard', new Clipboard('[data-clipboard-text]'));
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'clipboard').destroy();
  }
});
