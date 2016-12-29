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
    set(this, 'watcher', new spaniel.Watcher({ ratio: get(this, 'ratio') || -2 }));
  },

  didInsertElement() {
    this._super(...arguments);
    this._setupViewport();
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'watcher').unwatch(get(this, 'element'));
  },

  _disableWhenLast: observer('nextLink', function() {
    if (isEmpty(get(this, 'nextLink'))) {
      get(this, 'watcher').unwatch(get(this, 'element'));
    }
  }),

  _setupViewport() {
    const el = get(this, 'element');
    get(this, 'watcher').watch(el, () => {
      get(this, 'getNextData').perform();
    });
  }
});
