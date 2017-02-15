import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import observer from 'ember-metal/observer';
import PaginationMixin from 'client/mixins/pagination';
import spaniel from 'spaniel';

export default Component.extend(PaginationMixin, {
  loadingSize: 'small',

  init() {
    this._super(...arguments);
    set(this, 'watcher', new spaniel.Watcher({ rootMargin: this._getRootMargin() }));
  },

  didInsertElement() {
    this._super(...arguments);
    this._setupViewport();
  },

  willDestroyElement() {
    this._super(...arguments);
    const element = get(this, 'element');
    get(this, 'watcher').unwatch(element);
  },

  /**
   * Remove the spaniel watcher when we don't have a nextLink anymore
   */
  _disableWhenLast: observer('nextLink', function() {
    if (isEmpty(get(this, 'nextLink'))) {
      const element = get(this, 'element');
      get(this, 'watcher').unwatch(element);
    }
  }),

  _setupViewport() {
    const element = get(this, 'element');
    spaniel.scheduleWork(() => {
      get(this, 'watcher').watch(element, () => {
        get(this, 'getNextData').perform();
      });
    });
  },

  _getRootMargin() {
    const rootMargin = get(this, 'rootMargin');
    return Object.assign({
      top: 0,
      left: 0,
      right: 0,
      bottom: -300
    }, rootMargin);
  }
});
