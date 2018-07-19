import Component from '@ember/component';
import { get, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { alias } from '@ember/object/computed';
import { invokeAction } from 'ember-invoke-action';
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
    this.viewportDivId = `infinite-pagination-viewport-${guidFor(this)}`;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          const instance = invokeAction(this, 'onPagination');
          set(this, 'taskInstance', instance);
        }
      });
    }, this._getObserverOptions());
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.observer) {
      const element = document.querySelector(`#${this.viewportDivId}`);
      this.observer.observe(element);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.observer) {
      const element = document.querySelector(`#${this.viewportDivId}`);
      this.observer.unobserve(element);
      this.observer.disconnect();
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
