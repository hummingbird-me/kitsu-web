import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { get, set, computed, getProperties, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['video-updater'],

  episode: null,
  media: alias('episode.media.content'),
  queryCache: service(),

  // Prompts for Updates
  didUpdate: false,
  didUndo: false,
  showUpdatePrompt: false,
  showJoinPrompt: false,
  // Auth Dialog
  authOpened: false,
  // Undo
  originalLibraryData: {},

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'updateLibraryEntry').perform();
  },

  mediaColumn: computed('media', function () {
    const mediaType = get(this, 'media.constructor.modelName');
    const mediaId = get(this, 'media.id');

    return { [`${mediaType}Id`]: mediaId };
  }),

  getLibraryEntry: task(function* () {
    if (!get(this, 'session.hasUser')) return;

    const userId = get(this, 'session.account.id');
    const cache = get(this, 'queryCache');
    const mediaType = get(this, 'media.constructor.modelName');
    const mediaColumn = get(this, 'mediaColumn');

    const filter = { userId, ...mediaColumn };
    const params = { filter, limit: 1 };
    const loadedEntry = yield cache.query('library-entry', params)
      .then(records => get(records, 'firstObject'));

    if (isEmpty(loadedEntry)) {
      return get(this, 'store').createRecord('library-entry', {
        status: 'current',
        user: get(this, 'session.account'),
        [mediaType]: get(this, 'media')
      });
    }
    return loadedEntry;
  }).drop(),

  updateLibraryEntry: task(function* (force = false) {
    set(this, 'didUndo', false);
    if (get(this, 'session.hasUser')) {
      const entry = yield get(this, 'getLibraryEntry').perform();

      if (force || get(entry, 'progress') + 1 === get(this, 'episode.number')) {
        set(entry, 'progress', get(this, 'episode.number'));
        // Store the previous library data so we can undo
        set(this, 'originalLibraryData', getProperties(entry, 'progress', 'status'));
        yield entry.save();
        set(this, 'didUpdate', true);
      } else {
        set(this, 'showUpdatePrompt', true);
      }
    } else {
      set(this, 'showJoinPrompt', true);
    }
  }).drop(),

  undoLibraryEntryUpdate: task(function* () {
    const entry = yield get(this, 'getLibraryEntry').perform();

    setProperties(entry, get(this, 'originalLibraryData'));
    yield entry.save();
    set(this, 'didUpdate', false);
    set(this, 'didUndo', true);
  })
});
