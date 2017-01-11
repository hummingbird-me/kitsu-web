import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    console.log('uhhhh?', ...arguments);
    set(this, 'url', get(this, 'link.profile.url'));
  },

  actions: {
    update(content) {
      set(this, 'url', content);
      invokeAction(this, 'update', content);
    }
  }
});
