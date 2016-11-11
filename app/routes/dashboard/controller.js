import Controller from 'ember-controller';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';

const MAGIC_NUMBER = 7;

export default Controller.extend({
  streamType: 'global',
  session: service(),

  streamId: computed('streamType', {
    get() {
      return get(this, 'streamType') === 'global' ? 'global' : get(this, 'session.account.id');
    }
  }).readOnly(),

  updateStreamType: observer('session.hasUser', 'session.account.followingCount', function() {
    this._updateType();
  }),

  init() {
    this._super(...arguments);
    this._updateType();
  },

  _updateType() {
    if (get(this, 'session.hasUser') === true) {
      if (get(this, 'session.account.followingCount') >= MAGIC_NUMBER) {
        set(this, 'streamType', 'timeline');
      }
    }
  }
});
