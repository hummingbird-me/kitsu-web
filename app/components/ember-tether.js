import Component from 'ember-tether/components/ember-tether';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  mouseEnter() {
    invokeAction(this, 'onHover');
  },

  mouseLeave() {
    invokeAction(this, 'onLeave');
  }
});
