import OneWayTextAreaComponent from 'ember-one-way-controls/components/one-way-textarea';
import { get } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import { later } from '@ember/runloop';
/* global autosize */

export default OneWayTextAreaComponent.extend({
  autocomplete: 'ignore',

  keyUp() { },
  keyDown(event) {
    const method = get(this, `keyEvents.${event.keyCode}`);
    if (method) {
      invokeAction(this, method, this, event, event.target.value);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    autosize(get(this, 'element'));
    later(() => {
      this.resize();
      if (get(this, 'autofocus') && !get(this, 'isDestroyed')) {
        this.$().focus();
      }
    }, 200);
  },

  willDestroyElement() {
    autosize.destroy(get(this, 'element'));
    this._super(...arguments);
  },

  clear() {
    this.$().val('');
    this.resize();
  },

  resize() {
    if (get(this, 'isDestroyed')) { return; }
    autosize.update(get(this, 'element'));
  }
});
