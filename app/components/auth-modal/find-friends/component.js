import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  actions: {
    close() {
      get(this, 'close')();
    }
  }
});
