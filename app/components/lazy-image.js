import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { scheduleOnce, next } from 'ember-runloop';

export default Component.extend({
  classNames: ['lazy-image'],
  classNameBindings: ['isLoaded'],
  isLoaded: false,
  viewport: service(),

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
      image.onload = () => {
        if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
        next(() => {
          set(this, 'isLoaded', true);
        });
      };
    }
  },

  _setupViewport() {
    const element = get(this, 'element');
    this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(element, () => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
      this._swapAttributes();
      this._loadImage();
    }, { ratio: get(this, 'ratio') || -1 });
  },

  _teardownViewport() {
    if (this.clearViewportCallback) {
      this.clearViewportCallback();
    }
  }
});
