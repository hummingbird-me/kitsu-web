import Component from '@ember/component';
import { get, set } from '@ember/object';
import { scheduleOnce, next } from '@ember/runloop';
import observerManager from '../utils/observer-manager';

export default Component.extend({
  classNames: ['lazy-image'],
  classNameBindings: ['isLoaded'],
  isLoaded: false,

  didReceiveAttrs() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      this._setupViewport();
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this._teardownViewport();
  },

  /**
   * Swap `data-*` lazy attributes for their counterpart
   */
  _swapAttributes() {
    const image = this.$('img');
    const source = image.attr('data-src');
    if (source) {
      image.attr('src', source);
      image.removeAttr('data-src');
    }
  },

  /**
   * Swap the component loading state based on the loaded state of the image itself
   */
  _loadImage() {
    const [image] = this.$('img');
    if (image.complete) {
      set(this, 'isLoaded', true);
    } else {
      const fn = () => {
        next(() => {
          if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
          set(this, 'isLoaded', true);
        });
      };
      image.onload = () => { fn(); };
      image.onerror = () => { fn(); };
    }
  },

  _setupViewport() {
    const options = { root: null, rootMargin: this._getRootMargin(), threshold: 0 };
    const observe = observerManager(options);
    this.unobserve = observe(this.element, (entry) => {
      if (entry && entry.isIntersecting) {
        if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
        this._swapAttributes();
        this._loadImage();
        if (this.unobserve) { this.unobserve(); }
      }
    });
  },

  _teardownViewport() {
    if (this.unobserve) { this.unobserve(); }
  },

  _getRootMargin() {
    let rootMargin = get(this, 'rootMargin');
    rootMargin = Object.assign({
      top: 0,
      left: 0,
      right: 0,
      bottom: 300
    }, rootMargin);
    return `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`;
  }
});
