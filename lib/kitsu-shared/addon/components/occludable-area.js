import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { join } from '@ember/runloop';
import { scheduleWork } from 'spaniel';
import layout from 'kitsu-shared/templates/components/occludable-area';

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

  viewport: service(),

  didInsertElement() {
    this._super(...arguments);
    const element = get(this, 'element');

    // Add the bufferClass to the element
    element.classList.add(get(this, 'bufferClass'));

    // Setup spaniel viewport watcher on this element
    this.clearViewportCallback = get(this, 'viewport').onInViewportOnce(element, () => {
      if (get(this, 'isDestroyed')) { return; }
      // Schedule work so that the occludable area is rendered in the next animation frame
      scheduleWork(() => {
        scheduleWork(() => {
          join(() => {
            if (get(this, 'isDestroyed')) { return; }
            set(this, 'shouldRender', true);
          });
        });
      });
    }, this._getWatcherOptions());
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
    // Clear the spaniel viewport watcher instance
    if (this.clearViewportCallback) {
      this.clearViewportCallback();
    }
  },

  /**
   * Returns the config passed to spaniel's watcher.
   *
   * @returns {Object} RootMargin config
   */
  _getWatcherOptions() {
    const defaultOptions = this._getDefaultRootMargin();
    const rootMargin = Object.assign(defaultOptions, get(this, 'rootMargin') || {});
    rootMargin.bottom *= -1;
    return { rootMargin, ALLOW_CACHED_SCHEDULER: true };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 0 };
  }
});
