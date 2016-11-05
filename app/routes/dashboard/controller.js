import Controller from 'ember-controller';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Controller.extend({
  session: service(),

  /**
   * TODO/FEED: Should determine from session.account whether we should load
   * timeline or global.
   */
  streamType: computed('session.hasUser', {
    get() {
      return get(this, 'session.hasUser') ? 'timeline' : 'global';
    }
  }).readOnly(),

  streamId: computed('streamType', {
    get() {
      return get(this, 'streamType') === 'global' ? 'global' : get(this, 'session.account.id');
    }
  }).readOnly()
});
