import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  didReceiveAttrs() {
    set(this, 'dupQuery', get(this, 'query'));
  },

  actions: {
    updateQuery(content) {
      set(this, 'dupQuery', content);
      invokeAction(this, 'update', content);
    }
  }
});
