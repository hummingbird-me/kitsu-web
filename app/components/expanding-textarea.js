import OneWayTextAreaComponent from 'ember-one-way-controls/components/one-way-textarea';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';
import { later } from 'ember-runloop';
/* global autosize */

export default OneWayTextAreaComponent.extend({
  keyUp() { },
  keyDown(event) {
    const method = get(this, `keyEvents.${event.keyCode}`);
    if (method) {
      invokeAction(this, method, this, event, event.target.value);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    autosize(this.$());
    later(() => {
      this.resize();
      if (get(this, 'autofocus')) {
        this.$().focus();
      }
    }, 200);
  },

  willDestroyElement() {
    this._super(...arguments);
    const evt = document.createEvent('Event');
    evt.initEvent('autosize:destroy', true, false);
    this.$()[0].dispatchEvent(evt);
  },

  clear() {
    this.$().val('');
    this.resize();
  },

  resize() {
    if (get(this, 'isDestroyed')) {
      return;
    }
    const evt = document.createEvent('Event');
    evt.initEvent('autosize:update', true, false);
    this.$()[0].dispatchEvent(evt);
  }
});
