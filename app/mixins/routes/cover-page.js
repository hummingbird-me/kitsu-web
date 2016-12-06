import Mixin from 'ember-metal/mixin';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import { bind, later, cancel, scheduleOnce } from 'ember-runloop';
import jQuery from 'jquery';

const DISTANCE = 210;

export default Mixin.create({
  isHovered: false,

  activate() {
    this._super(...arguments);
    jQuery('body').addClass('cover-page');
    jQuery(document).on('scroll.cover', bind(this, '_handleScroll'));
    scheduleOnce('afterRender', bind(this, '_handleScroll'));
    scheduleOnce('afterRender', () => {
      jQuery('.primary-nav').hover(() => {
        cancel(get(this, 'timer'));
        jQuery('.primary-nav').removeClass('transparent');
        set(this, 'isHovered', true);
      }, () => {
        if (jQuery(window).scrollTop() < DISTANCE && isEmpty(jQuery('#search').val()) === true) {
          const timer = later(() => jQuery('.primary-nav').addClass('transparent'), 500);
          set(this, 'timer', timer);
        }
        set(this, 'isHovered', false);
      });
    });
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('cover-page');
    jQuery('.primary-nav').unbind('mouseenter').unbind('mouseleave');
    jQuery(document).off('scroll.cover');
  },

  _handleScroll() {
    if (jQuery(window).scrollTop() >= DISTANCE) {
      jQuery('.primary-nav').removeClass('transparent');
    } else if (get(this, 'isHovered') === false && isEmpty(jQuery('#search').val()) === true) {
      jQuery('.primary-nav').addClass('transparent');
    }
  }
});
