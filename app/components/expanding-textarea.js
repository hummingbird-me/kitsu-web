import OneWayTextAreaComponent from 'ember-one-way-controls/components/one-way-textarea';
import { get } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import { later } from '@ember/runloop';
/* global autosize */

/* TODO: ember-one-way-controls is deprecated, use native textarea for expanding-textarea instead.
Also remove height fix from shame.css (.report-content-input) by using textarea rows attribute
Migration: https://github.com/DavyJonesLocker/ember-one-way-controls#migrating
{{! old }}
{{one-way-textarea myValue update=(action (mut myValue))}}
{{! new }}
<textarea value={{myValue}} oninput={{action (mut myValue) value="target.value"}}></textarea>
*/

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
