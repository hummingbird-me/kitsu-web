import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { bind, later, cancel, scheduleOnce } from 'ember-runloop';
import jQuery from 'jquery';

export default Mixin.create({
  activate() {
    this._super(...arguments);
    jQuery('body').addClass('cover-page');

    const binding = bind(this, '_handleScroll');
    set(this, 'scrollBinding', binding);
    jQuery(document).on('scroll', binding);

    const hoverBinding = bind(this, '_handleHover');
    set(this, 'hoverBinding', hoverBinding);

    scheduleOnce('afterRender', () => this._handleScroll());
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('cover-page');
    jQuery(document).off('scroll', get(this, 'scrollBinding'));
    jQuery('.primary-nav').off('mouseenter', get(this, 'hoverBinding'));
  },

  _handleScroll() {
    if (jQuery(window).scrollTop() >= 210) {
      jQuery('.primary-nav').removeClass('transparent');
      jQuery('.primary-nav').off('mouseenter', get(this, 'hoverBinding'));
    } else {
      jQuery('.primary-nav').addClass('transparent');
      jQuery('.primary-nav').on('mouseenter', get(this, 'hoverBinding'));
    }
  },

  _handleHover() {
    jQuery('.primary-nav').removeClass('transparent');
    cancel(get(this, 'timer'));
    jQuery('.primary-nav').one('mouseleave', () => {
      const timer = later(() => jQuery('.primary-nav').addClass('transparent'), 1000);
      set(this, 'timer', timer);
    });
  }
});
