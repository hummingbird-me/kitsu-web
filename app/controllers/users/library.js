import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import service from 'ember-service/inject';
import { storageFor } from 'ember-local-storage';
import libraryStatus from 'client/utils/library-status';

export default Controller.extend({
  queryParams: ['media', 'status'],
  media: 'anime',
  status: 'current',

  session: service(),
  entries: alias('taskValue'),
  lastUsed: storageFor('last-used'),

  /**
   * Returns an array of the other library page options
   */
  mediaList: computed('media', {
    get() {
      const list = ['anime', 'manga'];
      const media = get(this, 'media');
      list.splice(list.findIndex(m => m === media), 1);
      return list;
    }
  }).readOnly(),

  /**
   * Filters the entries by their status and state into an object of
   * `{ status: entries, ... }`
   */
  sections: computed('entries.@each.{status,isDeleted}', {
    get() {
      const sections = {};
      get(this, 'statuses').slice(1).forEach((status) => {
        const entries = get(this, 'entries')
          .filterBy('status', status)
          .filterBy('isDeleted', false);
        sections[status] = entries;
      });
      return sections;
    }
  }).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'statuses', ['all', ...libraryStatus.getEnumKeys()]);
  },

  _saveFilter: observer('media', function() {
    // its possible for this to proc before setupController from the route has fired
    // we don't actually want to update the cache when it's a direct route request anyway.
    if (get(this, 'user')) {
      if (get(this, 'session').isCurrentUser(get(this, 'user'))) {
        const lastUsed = get(this, 'lastUsed');
        set(lastUsed, 'libraryType', get(this, 'media'));
      }
    }
  })
});
