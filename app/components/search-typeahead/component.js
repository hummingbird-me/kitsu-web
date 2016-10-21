import Component from 'ember-component';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  init() {
    this._super(...arguments);
    set(this, 'items', []);
  },

  actions: {
    update(value) {
      if (isEmpty(value) === true) {
        set(this, 'items', []);
      } else {
        invokeAction(this, 'search', value).then((items) => {
          set(this, 'items', items);
        });
      }
    }
  }
});
