import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { assert } from 'ember-metal/utils';
import { addObserver, removeObserver } from 'ember-metal/observer';
import { later } from 'ember-runloop';
import jQuery from 'jquery';
/* global Tether */

export default Component.extend({
  classNames: ['epic-tooltip'],
  attachment: 'middle left',
  targetAttachment: 'middle right',
  isHovered: false,
  isStatic: false,

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

    // only one epic-tooltip open at a single time
    if (get(this, 'singleInstance') === true) {
      get(this, 'epicTooltip').register(this);
    }
  },

  didInsertElement() {
    this._super(...arguments);

    // initialize tether
    const tether = new Tether({
      enabled: true,
      element: this.$(),
      target: get(this, 'target'),
      attachment: get(this, 'attachment'),
      targetAttachment: get(this, 'targetAttachment'),
      constraints: get(this, 'constraints'),
      offset: get(this, 'offset') || '0px 0px'
    });
    set(this, 'tether', tether);
    tether.position();

    if (get(this, 'isStatic') === false) {
      // listen to hover events on the target
      jQuery(get(this, 'target')).hoverIntent({
        over: () => this.targetEntered(),
        out: () => this.targetLeave(),
        timeout: get(this, 'timeout') || 0
      });

      // because hoverIntent `out` doesn't fire unless `over` has fired, we need to exit
      // for the first time
      jQuery(get(this, 'target')).one('mouseleave', () => {
        later(() => this.targetLeave(), get(this, 'timeout') || 0);
      });
    } else {
      this.targetEntered();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'singleInstance') === true) {
      get(this, 'epicTooltip').remove(this);
    }

    if (get(this, 'isStatic') === false) {
      jQuery(get(this, 'target'))
        .off('mouseenter.hoverIntent')
        .off('mouseleave.hoverIntent');
    }

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
    if (get(this, 'isHovered') === true) {
      addObserver(this, 'isHovered', this.targetLeave);
    } else {
      removeObserver(this, 'isHovered', this.targetLeave);
      if (!get(this, 'isDestroyed')) {
        get(this, 'tether').disable();
        this.$().hide();
      }
    }
  }
});
