import Component from '@ember/component';
import { get, set, computed, getProperties, setProperties } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['video-embed'],

  queryCache: service(),
  store: service(),

  // ===Parameters===
  episode: null,
  // Automatically-set params
  media: alias('episode.media.content'),
  videoId: alias('getVideo.last.value.embedData.eid'),

  // ===State===
  // Loading
  playerLoaded: false,
  loaded: and('playerLoaded', 'getVideo.isIdle'),
  loading: not('loaded'),
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
    get(this, 'getVideo').perform();
  },

  mediaColumn: computed('media', function () {
    const mediaType = get(this, 'media.constructor.modelName');
    const mediaId = get(this, 'media.id');

    return { [`${mediaType}Id`]: mediaId };
  }),

  onProgress({ position, duration }) {
    if (get(this, 'didUpdate')
    || get(this, 'showUpdatePrompt')
    || get(this, 'showJoinPrompt')) {
      return;
    }

    const progress = position / duration;
    const remaining = duration - position;

    // more than 90% done or less than 5 minutes remaining
    if (progress > 0.9 || remaining < 300) {
      get(this, 'updateLibraryEntry').perform();
    }
  },

  onPlayerLoad() {
    set(this, 'playerLoaded', true);
  },

  getVideo: task(function* () {
    const cache = get(this, 'queryCache');
    const episodeId = get(this, 'episode.id');

    const filter = { episodeId };
    const page = { limit: 1 };
    const params = { filter, /* sort: '-preference', */ page };

    return yield cache.query('video', params).then(records => get(records, 'firstObject'));
  }).drop(),

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

      console.log('ENTRY', entry);
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
