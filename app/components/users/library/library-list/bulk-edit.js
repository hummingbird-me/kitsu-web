import Component from 'ember-component';
import set from 'ember-metal/set';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    set(this, 'libraryEntryStatuses', LIBRARY_STATUSES);
  }
});
