import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  actions: {
    changeComponent(component) {
      get(this, 'changeComponent')(component);
    }
  }
});
