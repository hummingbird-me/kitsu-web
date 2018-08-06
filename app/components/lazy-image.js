import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  classNames: ['lazy-image'],

  didUpdateAttrs() {
    scheduleOnce('afterRender', () => {
      this.element.querySelector('img').classList.remove('lazyload');
      this.element.querySelector('img').classList.add('lazyload');
    });
  }
});
