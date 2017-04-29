import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { storageFor } from 'ember-local-storage';

const MAGIC_NUMBER = 7;

export default Controller.extend({
  lastUsed: storageFor('last-used'),

  streamId: computed('streamType', function() {
    return get(this, 'streamType') === 'global' ? 'global' : get(this, 'session.account.id');
  }).readOnly(),

  init() {
    this._super(...arguments);
    const defaultType = this._getDefaultType();
    set(this, 'streamType', get(this, 'lastUsed.feedType') || defaultType);
  },

  _getDefaultType() {
    if (get(this, 'session.account.followingCount') >= MAGIC_NUMBER) {
      return 'timeline';
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
