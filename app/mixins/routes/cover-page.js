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
    scheduleOnce('afterRender', () => {
      jQuery('.primary-nav').addClass('transparent');
    });
  },

  deactivate() {
    this._super(...arguments);
    jQuery('body').removeClass('cover-page');
    jQuery(document).off('scroll', get(this, 'scrollBinding'));
  },

  _handleScroll() {
    if (jQuery(window).scrollTop() < 200) {
      jQuery('.primary-nav').removeClass('transparent');
      const timer = later(() => {
        if (jQuery(window).scrollTop() < 200) {
          jQuery('.primary-nav').addClass('transparent');
        }
      }, 1000);

      if (get(this, 'timer') !== undefined) {
        cancel(get(this, 'timer'));
      }
      set(this, 'timer', timer);
    }
  }
});
