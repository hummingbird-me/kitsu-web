import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { addObserver, removeObserver } from 'ember-metal/observer';
/* global hoverintent */

export default Mixin.create({
  hoverTimeout: 250,

  didInsertElement() {
    this._super(...arguments);
    const element = get(this, 'element');
    const hoverIntentInstance = hoverintent(element, () => {
      this._onMouseEnter();
    }, () => {
      this._onMouseLeave();
    }).options({ timeout: get(this, 'hoverTimeout') });
    set(this, 'hoverIntentInstance', hoverIntentInstance);
  },

  willDestroyElement() {
    this._super(...arguments);
    const hoverIntentInstance = get(this, 'hoverIntentInstance');
    if (hoverIntentInstance) {
      hoverIntentInstance.remove();
    }
  },

  _onMouseEnter() {
    if (get(this, 'isDestroyed')) { return; }
    set(this, 'showTooltip', true);
    set(this, 'isTooltipHovered', false);
  },

  _onMouseLeave() {
    if (get(this, 'isDestroyed')) { return; }
    // We don't want to close the tooltip if the tooltip itself is hovered.
    // The tooltip communicates that to us via the onHover/onLeave actions
    if (get(this, 'isTooltipHovered')) {
      // tooltip is currently hovered, so observe the variable and exit after
      addObserver(this, 'isTooltipHovered', this._onMouseLeave);
    } else {
      removeObserver(this, 'isTooltipHovered', this._onMouseLeave);
      set(this, 'showTooltip', false);
    }
  }
});
