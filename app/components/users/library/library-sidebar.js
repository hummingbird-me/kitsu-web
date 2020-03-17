import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { camelize } from '@ember/string';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { LIBRARY_STATUSES } from 'client/models/library-entry';

export default Component.extend({
  reactionIndex: 0,
  ajax: service(),
  store: service(),
  session: service(),

  reactions: reads('getIssuesTask.last.value.attributes'), // reactions
  reactionsCount: reads('reactions.length'),

  canEditLibrary: computed('session.hasUser', 'user', function() {
    if (!get(this, 'session.hasUser')) { return false; }
    const user = get(this, 'user');
    return get(this, 'session').isCurrentUser(user);
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.mediaOptions = ['anime', 'manga'];
    if (get(this, 'session.hasUser')) {
      get(this, 'preloadReactionsTask').perform();
    }
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
  },

  getIssuesTask: task(function* () {
    return yield get(this, 'ajax').request('/library-entries/_issues');
  }).drop(),

  preloadReactionsTask: task(function* () {
    yield get(this, 'getIssuesTask').perform();
    yield get(this, 'nextLibraryEntryTask').perform();
    set(this, 'reactionLibraryEntry', get(this, 'nextReactionLibraryEntry'));
    this.incrementProperty('reactionIndex');
    yield get(this, 'nextLibraryEntryTask').perform();
  }).drop(),

  nextLibraryEntryTask: task(function* () {
    const reactionIndex = get(this, 'reactionIndex');
    const libraryEntryId = get(this, 'reactions').objectAt(reactionIndex);
    const libraryEntry = yield get(this, 'store').findRecord('library-entry', libraryEntryId, {
      include: 'anime,manga',
      reload: true
    });
    set(this, 'nextReactionLibraryEntry', libraryEntry);
    // preload the image
    this.preloadImage = new Image();
    this.preloadImage.src = get(libraryEntry, 'media.posterImage.medium');
  }).drop(),

  actions: {
    resetLibrary(...args) {
      set(this, 'isResetLoading', true);
      invokeAction(this, 'resetLibrary', ...args).finally(() => {
        set(this, 'isResetLoading', false);
      });
    },

    loadNextReaction(isSkip = false) {
      if (!isSkip) {
        this.decrementProperty('reactionsCount');
      }
      this.incrementProperty('reactionIndex');
      set(this, 'reactionLibraryEntry', get(this, 'nextReactionLibraryEntry'));
      get(this, 'nextLibraryEntryTask').perform();
    }
  }
});
