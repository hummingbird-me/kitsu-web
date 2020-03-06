import Component from '@ember/component';
import { get, set } from '@ember/object';
import layout from 'kitsu-shared/templates/components/occludable-area';
import observerManager from 'client/utils/observer-manager';
import batcher from 'ember-batcher/batcher';

/**
 * Occlusion based off work from LinkedIn.
 * Original source @ https://github.com/sreedhar7/ember-occludable-components
 *
 * {{#occludable-area bufferClass="class-name"}}
 *   {{my-component}}
 * {{/occludable-area}}
 */
export default Component.extend({
  layout,
  classNames: ['occludable-area'],
  shouldRender: false,

  didInsertElement() {
    this._super(...arguments);
    const element = get(this, 'element');
    element.classList.add(get(this, 'bufferClass'));

    const observe = observerManager(this._getObserverOptions());
    this.unobserve = observe(element, entry => {
      if (entry && entry.isIntersecting) {
        this.isVisible();
        if (this.unobserve) { this.unobserve(); }
      }
    });
  },

  didRender() {
    this._super(...arguments);
    // Buffer class is no longer needed once the component has been rendered
    if (get(this, 'shouldRender')) {
      get(this, 'element').classList.remove(get(this, 'bufferClass'));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.unobserve) { this.unobserve(); }
  },

  isVisible() {
    if (get(this, 'isDestroyed')) { return; }
    batcher.scheduleWork(() => {
      if (get(this, 'isDestroyed')) { return; }
      batcher.scheduleWork(() => {
        if (get(this, 'isDestroyed')) { return; }
        set(this, 'shouldRender', true);
      });
    });
  },

  /**
   * Returns the config passed to the IntersectionObserver
   *
   * @returns {Object} RootMargin config
   */
  _getObserverOptions() {
    const defaultOptions = this._getDefaultRootMargin();
    let rootMargin = Object.assign(defaultOptions, get(this, 'rootMargin') || {});
    rootMargin = `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`;
    return { root: null, rootMargin, threshold: 0 };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 0 };
  }
});
