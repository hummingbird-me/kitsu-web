import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import { storageFor } from 'ember-local-storage';

export default Controller.extend({
  queryParams: ['media', 'status', 'sort', 'limt', 'preserveScrollPosition'],
  media: 'anime',
  status: 'current',
  sort: '-updated_at',
  limit: 25,
  preserveScrollPosition: true,

  layoutType: 'grid',
  mediaList: ['anime', 'manga'],
  entries: alias('taskValue'),
  lastUsed: storageFor('last-used'),

  /**
   * Filters the entries by their status and state into an object of
   * `{ status: entries, ... }`
   */
  sections: computed('entries.@each.{status,isDeleted}', function() {
    const sections = {};
    get(this, 'statuses').slice(1).forEach((status) => {
      const entries = get(this, 'entries')
        .filterBy('status', status)
        .filterBy('isDeleted', false);
      sections[status] = entries;
    });
    return sections;
  }).readOnly(),

  _saveFilter: observer('media', 'sort', function() {
    // its possible for this to proc before setupController from the route has fired
    // we don't actually want to update the cache when it's a direct route request anyway.
    if (get(this, 'user')) {
      if (get(this, 'session').isCurrentUser(get(this, 'user'))) {
        const lastUsed = get(this, 'lastUsed');
        set(lastUsed, 'libraryType', get(this, 'media'));
        set(lastUsed, 'librarySort', get(this, 'sort'));
      }
    }
  })
});
