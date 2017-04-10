import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Component.extend({
  classNames: ['ember-occlusion-culling'],
  shouldRender: false,
  viewport: service(),

  didInsertElement() {
    this._super(...arguments);
    const element = get(this, 'element');

    // add buffer class, this should add a min-height to the occlusion-culling component.
    if (get(this, 'bufferClass')) {
      element.classList.add(get(this, 'bufferClass'));
    }

    // setup a one-time viewport listener to switch the rendering state
    this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(element, () => {
      if (get(this, 'isDestroyed')) { return; }
      set(this, 'shouldRender', true);
    }, this._getWatcherOptions());
  },

  didRender() {
    this._super(...arguments);
    // remove the bufferClass upon render
    if (get(this, 'shouldRender') && get(this, 'bufferClass')) {
      get(this, 'element').classList.remove(get(this, 'bufferClass'));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    // remove viewport listener
    if (this.clearViewportCallback) {
      this.clearViewportCallback();
    }
  },

  /**
   * Returns the `WatcherConfig` object passed to the `Watcher` instance.
   *
   * @returns {object}
   */
  _getWatcherOptions() {
    const rootMargin = Object.assign(this._getDefaultRootMargin(), get(this, 'rootMargin') || {});
    rootMargin.bottom *= -1;
    return { rootMargin };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 0 };
  }
});
