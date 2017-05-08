import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { guidFor } from 'ember-metal/utils';
import { invokeAction } from 'ember-invoke-action';
import spaniel from 'spaniel';

/**
 * Inifinite scrolling wrapper component.
 *
 * Example:
 *
 * {{#infinite-pagination onPagination=(action ...)}}
 *   {{your-work}}
 * {{/infinite-pagination}}
 */
export default Component.extend({
  tagName: '',
  loaderSize: 'large',
  isTop: false,
  isLoading: false,
  showLoader: true,

  init() {
    this._super(...arguments);
    const Watcher = new spaniel.Watcher(this._getWatcherOptions());
    set(this, 'Watcher', Watcher);
    set(this, 'viewportDivId', `infinite-pagination-viewport-${guidFor(this)}`);
  },

  didInsertElement() {
    this._super(...arguments);
    const Watcher = get(this, 'Watcher');
    if (Watcher) {
      const element = document.querySelector(`#${get(this, 'viewportDivId')}`);
      Watcher.watch(element, () => {
        this._setLoadingState(true);
        invokeAction(this, 'onPagination').finally(this._setLoadingState(false).bind(this));
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    const Watcher = get(this, 'Watcher');
    if (Watcher) {
      const element = document.querySelector(`#${get(this, 'viewportDivId')}`);
      Watcher.unwatch(element);
    }
  },

  _setLoadingState(state) {
    if (get(this, 'isDestroyed')) { return; }
    set(this, 'isLoading', state);
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
    return { rootMargin };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 400 };
  }
});
