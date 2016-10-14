import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';

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
        get(this, 'search')(value).then((items) => {
          set(this, 'items', items);
        });
      }
    }
  }
});
