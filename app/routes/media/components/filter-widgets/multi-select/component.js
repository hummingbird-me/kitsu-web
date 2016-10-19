import Component from 'ember-component';
import { invokeAction } from 'ember-invoke-action';
import get from 'ember-metal/get';
import { copy } from 'ember-metal/utils';

export default Component.extend({
  tagName: 'ul',
  includeAll: false,

  actions: {
    toggle(option) {
      const value = copy(get(this, 'selected'));
      if (value.includes(option)) {
        value.removeObject(option);
      } else {
        value.addObject(option);
      }
      invokeAction(this, 'onChange', value);
    },

    clear() {
      invokeAction(this, 'onChange', []);
    }
  }
});
