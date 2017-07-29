import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { guidFor } from 'ember-metal/utils';
import { alias } from 'ember-computed';
import { invokeAction } from 'ember-invoke-action';
import spaniel from 'spaniel';
import layout from 'kitsu-shared/templates/components/infinite-pagination';

/**
 * Infinite scrolling wrapper component.
 *
 * Example:
 *
 * {{#infinite-pagination onPagination=(action ...)}}
 *   {{your-work}}
 * {{/infinite-pagination}}
 */
export default Component.extend({
  layout,
  tagName: '',
  loaderSize: 'large',
  isTop: false,
  showLoader: true,
  isLoading: alias('taskInstance.isRunning'),

  init() {
    this._super(...arguments);
    this.Watcher = new spaniel.Watcher(this._getWatcherOptions());
    this.viewportDivId = `infinite-pagination-viewport-${guidFor(this)}`;
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.Watcher) {
      const element = document.querySelector(`#${this.viewportDivId}`);
      this.Watcher.watch(element, () => {
        const instance = invokeAction(this, 'onPagination');
        set(this, 'taskInstance', instance);
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.Watcher) {
      const element = document.querySelector(`#${this.viewportDivId}`);
      this.Watcher.unwatch(element);
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
    return { rootMargin };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 400 };
  }
});
