import Component from 'ember-component';
import set from 'ember-metal/set';
import libraryStatus from 'client/utils/library-status';

export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    set(this, 'libraryEntryStatuses', libraryStatus.getEnumKeys());
  }
});
