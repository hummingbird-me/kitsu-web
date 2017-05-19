import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { camelize } from 'ember-string';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.mediaOptions = ['anime', 'manga'];
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'counts')) { return; }

    // Build object of `{ status: count }` as the API only ships down values > 0.
    const counts = LIBRARY_STATUSES.reduce((previous, current) => {
      const status = camelize(current);
      const value = get(this, `counts.${status}`) || 0;
      return { ...previous, [current]: value };
    }, {});
    set(this, 'libraryCounts', counts);

    // Sum all values for total count
    const total = Object.values(counts).reduce((previous, current) => previous + current, 0);
    set(this, 'totalCount', total);
  }
});
