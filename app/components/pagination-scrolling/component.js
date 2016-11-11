import Component from 'ember-component';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import observer from 'ember-metal/observer';
import InViewportMixin from 'ember-in-viewport';
import PaginationMixin from 'client/mixins/pagination';

export default Component.extend(InViewportMixin, PaginationMixin, {
  tolerance: { top: 0, left: 0, bottom: 0, right: 0 },

  init() {
    this._super(...arguments);
    setProperties(this, {
      viewportSpy: true,
      viewportTolerance: get(this, 'tolerance')
    });
    this._disable();
  },

  didEnterViewport() {
    this._super(...arguments);
    get(this, 'getNextData').perform().catch(() => {});
  },

  _disableWhenLast: observer('nextLink', function() {
    this._disable();
  }),

  _disable() {
    if (get(this, 'nextLink') === undefined) {
      set(this, 'viewportEnabled', false);
    }
  }
});
