import Controller from 'ember-controller';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import { storageFor } from 'ember-local-storage';

const MAGIC_NUMBER = 7;

export default Controller.extend({
  lastUsed: storageFor('last-used'),
  session: service(),

  streamId: computed('streamType', 'session.hasUser', {
    get() {
      return get(this, 'streamType') === 'global' ? 'global' : get(this, 'session.account.id');
    }
  }).readOnly(),

  updateStreamType: observer('session.hasUser', 'session.account.followingCount', function() {
    const defaultType = this._getDefaultType();
    set(this, 'streamType', get(this, 'lastUsed.feedType') || defaultType);
  }),

  init() {
    this._super(...arguments);
    const defaultType = this._getDefaultType();
    if (get(this, 'session.hasUser')) {
      set(this, 'streamType', get(this, 'lastUsed.feedType') || defaultType);
    } else {
      set(this, 'streamType', defaultType);
    }
  },

  _getDefaultType() {
    if (get(this, 'session.hasUser')) {
      if (get(this, 'session.account.followingCount') >= MAGIC_NUMBER) {
        return 'timeline';
      }
    }
    return 'global';
  },

  actions: {
    switchFeed(type) {
      set(this, 'streamType', type);
      set(this, 'lastUsed.feedType', type);
    }
  }
});
