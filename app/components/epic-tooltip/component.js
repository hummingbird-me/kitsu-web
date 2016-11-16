import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { assert } from 'ember-metal/utils';
import { scheduleOnce } from 'ember-runloop';
/* global Tether */

export default Component.extend({
  classNames: ['epic-tooltip'],
  attachment: 'middle left',
  targetAttachment: 'middle left',

  init() {
    this._super(...arguments);
    assert('Must pass a target to {{epic-tooltip}}', get(this, 'target') !== undefined);
    set(this, 'constraints', get(this, 'constraints') || [{ to: 'window', attachment: 'together' }]);
  },

  didInsertElement() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      const tether = new Tether({
        element: this.$(),
        target: get(this, 'target'),
        attachment: get(this, 'attachment'),
        //targetAttachment: get(this, 'targetAttachment'),
        enabled: true
      });
      set(this, 'tether', tether);
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'tether').destroy();
    this.$().remove();
  }
});
