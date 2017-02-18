import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { guidFor } from 'ember-metal/utils';
import computed from 'ember-computed';
import { strictInvokeAction } from 'ember-invoke-action';
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
  isLoading: false,
  showLoader: true,

  viewportDivId: computed(function() {
    const GUID = guidFor(this);
    return `infinite-pagination-viewport-${GUID}`;
  }).readOnly(),

  init() {
    this._super(...arguments);
    const Watcher = new spaniel.Watcher(this._getWatcherOptions());
    set(this, 'Watcher', Watcher);
  },

  didInsertElement() {
    this._super(...arguments);
    const Watcher = get(this, 'Watcher');
    if (Watcher) {
      const element = document.querySelector(`#${get(this, 'viewportDivId')}`);
      Watcher.watch(element, (eventName) => {
        // `exposed` is at least 1px visible in the viewport
        if (eventName === 'exposed') {
          set(this, 'isLoading', true);
          strictInvokeAction(this, 'onPagination').finally(() => {
            set(this, 'isLoading', false);
          });
        }
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

  /**
   * Returns the `WatcherConfig` passed to the `Watcher` instance.
   *
   * @returns {WatcherConfig}
   */
  _getWatcherOptions() {
    const rootMargin = Object.assign(this._getDefaultRootMargin(), get(this, 'rootMargin') || {});
    rootMargin.bottom *= -1;
    return { rootMargin };
  },

  _getDefaultRootMargin() {
    return { top: 0, left: 0, right: 0, bottom: 400 };
  }
});
