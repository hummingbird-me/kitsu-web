import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  delay: 1000,
  dirtyText: undefined,

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'dirtyText', get(this, 'text'));
  },

  updateTask: task(function* (value) {
    set(this, 'dirtyText', value);
    yield timeout(get(this, 'delay'));
    invokeAction(this, 'update', value);
  }).restartable()
});
