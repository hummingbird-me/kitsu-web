import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { assert } from 'ember-metal/utils';
import { scheduleOnce, later } from 'ember-runloop';
import { addObserver, removeObserver } from 'ember-metal/observer';
import jQuery from 'jquery';
/* global Tether */

export default Component.extend({
  classNames: ['epic-tooltip'],
  attachment: 'middle left',
  targetAttachment: 'middle right',
  isHovered: false,
  epicTooltip: service(),

  mouseEnter() {
    set(this, 'isHovered', true);
  },

  mouseLeave() {
    set(this, 'isHovered', false);
  },

  init() {
    this._super(...arguments);
    assert('Must pass a target to {{epic-tooltip}}', get(this, 'target') !== undefined);
    set(this, 'constraints', get(this, 'constraints') || [{ to: 'scrollParent', attachment: 'together' }]);

    // only one epic-tooltip open at a single time
    if (get(this, 'singleInstance') === true) {
      get(this, 'epicTooltip').register(this);
    }

    // listen for hover events on the target and enable/disable tether
    // TODO: handle other types of triggers
    scheduleOnce('afterRender', () => {
      jQuery(get(this, 'target')).mouseenter(() => {
        later(() => this.targetEntered(), get(this, 'openDelay') || 0);
      }).mouseleave(() => {
        later(() => {
          if (get(this, 'isHovered') === true) {
            addObserver(this, 'isHovered', this.targetLeave);
          } else {
            this.targetLeave();
          }
        }, get(this, 'closeDelay') || 0);
      });
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);

    // initialize tether
    scheduleOnce('afterRender', () => {
      const tether = new Tether({
        element: this.$(),
        target: get(this, 'target'),
        attachment: get(this, 'attachment'),
        targetAttachment: get(this, 'targetAttachment'),
        enabled: true,
        constraints: get(this, 'constraints')
      });
      set(this, 'tether', tether);
      tether.position();
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    jQuery(get(this, 'target')).off('mouseenter').off('mouseleave');
    get(this, 'tether').destroy();
    this.$().remove();
  },

  targetEntered() {
    if (get(this, 'singleInstance') === true) {
      get(this, 'epicTooltip').all().forEach(component => component.targetLeave());
    }
    get(this, 'tether').enable();
    get(this, 'tether').position();
    this.$().show();
  },

  targetLeave() {
    if (get(this, 'isHovered') === false) {
      removeObserver(this, 'isHovered', this.targetLeave);
    }
    get(this, 'tether').disable();
    this.$().hide();
  }
});
