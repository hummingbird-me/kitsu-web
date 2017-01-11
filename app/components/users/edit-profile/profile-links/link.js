import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    update(content) {
      invokeAction(this, 'update', get(this, 'link'), content);
    },

    remove() {
      invokeAction(this, 'remove', get(this, 'link'));
    }
  }
});
