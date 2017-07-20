import Controller from 'ember-controller';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import { storageFor } from 'ember-local-storage';

const MAGIC_NUMBER = 7;

export default Controller.extend({
  lastUsed: storageFor('last-used'),

  streamId: computed('streamType', 'streamInterest', function() {
    const streamType = get(this, 'streamType');
    const interest = get(this, 'streamInterest');
    console.log(streamType);
    if (interest && streamType === 'interest_timeline') {
      return `${get(this, 'session.account.id')}-${capitalize(interest)}`;
    }
    return streamType === 'global' ? 'global' : get(this, 'session.account.id');
  }).readOnly(),

  init() {
    this._super(...arguments);
    const defaultType = this._getDefaultType();
    const cachedType = get(this, 'lastUsed.feedType');
    if (this._isCachedTypeOutdated(cachedType)) {
      set(this, 'lastUsed.feedType', defaultType);
    }
    if (cachedType && cachedType.includes('/')) {
      set(this, 'streamInterest', cachedType.split('/')[1]);
      set(this, 'streamType', cachedType.split('/')[0]);
    } else {
      set(this, 'streamType', cachedType || defaultType);
    }
  },

  actions: {
    switchFeed(type) {
      window.scrollTo(0, 0);
      console.log(type);
      if (type.includes('/')) {
        set(this, 'streamInterest', type.split('/')[1]);
        set(this, 'streamType', type.split('/')[0]);
      } else {
        set(this, 'streamInterest', null);
        set(this, 'streamType', type);
      }
      set(this, 'lastUsed.feedType', type);
    }
  },

  _getDefaultType() {
    if (get(this, 'session.account.followingCount') >= MAGIC_NUMBER) {
      return 'timeline';
    }
    return 'global';
  },

  _isCachedTypeOutdated(type) {
    return type === 'group_timeline';
  }
});
