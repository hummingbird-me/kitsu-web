import Component from '@ember/component';
import { get, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { alias } from '@ember/object/computed';
import { invokeAction } from 'ember-invoke-action';
import layout from 'kitsu-shared/templates/components/infinite-pagination';
import observerManager from 'client/utils/observer-manager';

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
    this.viewportDivId = `infinite-pagination-viewport-${guidFor(this)}`;
  },

  didInsertElement() {
    this._super(...arguments);

    const element = document.querySelector(`#${this.viewportDivId}`);
    const observe = observerManager(this._getObserverOptions());
    this.unobserve = observe(element, entry => {
      if (entry && entry.isIntersecting) {
        const instance = invokeAction(this, 'onPagination');
        set(this, 'taskInstance', instance);
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.unobserve) {
      this.unobserve();
    }
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
    return { top: 0, left: 0, right: 0, bottom: 400 };
  }
});
