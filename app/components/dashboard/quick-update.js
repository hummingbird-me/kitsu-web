import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import FlickityActionsMixin from 'client/mixins/flickity-actions';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(FlickityActionsMixin, Pagination, {
  classNames: ['quick-update'],
  filterOptions: ['all', 'anime', 'manga'],
  pageLimit: 12,
  notify: service(),
  queryCache: service(),
  raven: service(),
  store: service(),
  lastUsed: storageFor('last-used'),

  remaining: computed('initialEntries.length', function() {
    return 3 - (get(this, 'initialEntries.length') || 0);
  }).readOnly(),

  init() {
    this._super(...arguments);
    const filter = get(this, 'lastUsed.quickUpdateFilter') || 'all';
    set(this, 'filter', filter);
    this._getEntries();
  },

  onPagination() {
    this._super(...arguments);
    this._appendToFlickity();
  },

  getEntriesTask: task(function* () {
    const type = get(this, 'filter') !== 'all' ? get(this, 'filter') : undefined;
    const includes = type || 'anime,manga';
    const entries = yield this.queryPaginated('library-entry', {
      include: `${includes},unit`,
      filter: {
        kind: type,
        user_id: get(this, 'session.account.id'),
        status: 'current,planned'
      },
      fields: this._getFieldsets(type),
      sort: 'status,-progressed_at,-updated_at',
      page: { limit: get(this, 'pageLimit') }
    }, { cache: false });
    set(this, 'initialEntries', entries);
  }).drop(),

  actions: {
    saveEntry(entry) {
      return entry.save().then(() => {
        get(this, 'queryCache').invalidateType('library-entry');
      });
    },

    removeEntry(entry) {
      return entry.destroyRecord().then(() => {
        // remove element from flickity
        const elements = this.$(`[data-entry-id="${get(entry, 'id')}"]`).eq(0).parent();
        this.$('.carousel').flickity('remove', elements);
      }).catch(error => {
        entry.rollbackAttributes();
        get(this, 'raven').captureException(error);
      });
    },

    reloadUnit(entry) {
      const idWas = get(entry, 'unit.id');
      return entry.belongsTo('unit').reload().then(unit => {
        // if the id hasn't changed then that means the API returned a `null` value
        const value = get(unit, 'id') === idWas ? null : unit;
        set(entry, 'unit', value);
      }).catch(() => {
        set(entry, 'unit', null);
      });
    },

    createPost(entry, content) {
      if (isEmpty(content)) { return; }
      const post = get(this, 'store').createRecord('post', {
        content,
        spoiler: true,
        media: get(entry, 'media'),
        spoiledUnit: get(entry, 'unit'),
        user: get(this, 'session.account')
      });
      return post.save();
    },

    changeFilter(option) {
      if (get(this, 'filter') === option) { return; }
      set(this, 'filter', option);
      set(this, 'lastUsed.quickUpdateFilter', option);
      this._getEntries();
    }
  },

  _getEntries() {
    set(this, 'initialEntries', []);
    set(this, 'paginatedRecords', []);
    get(this, 'getEntriesTask').perform();
  },

  _appendToFlickity() {
    scheduleOnce('afterRender', () => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
      const index = this.$('.carousel').data('flickity').cells.length - 1;
      this.$('.carousel').flickity('insert', this.$('.new-entries').children(), index);
    });
  },

  _getFieldsets(type) {
    const fields = {
      libraryEntries: ['progress', 'status', 'rating', 'unit', 'reconsumeCount', 'private',
        'startedAt', 'finishedAt', 'notes', 'updatedAt']
    };

    const media = ['posterImage', 'canonicalTitle', 'titles', 'slug', 'subtype', 'startDate'];
    if (type === undefined) {
      fields.libraryEntries.push('anime', 'manga');
      fields.anime = ['episodeCount', ...media].join(',');
      fields.manga = ['chapterCount', ...media].join(',');
    } else {
      fields.libraryEntries.push(type);
      const unitType = type === 'anime' ? 'episodeCount' : 'chapterCount';
      fields[type] = [unitType, ...media].join(',');
    }
    fields.libraryEntries = fields.libraryEntries.join(',');

    if (type) {
      const unitKey = type === 'anime' ? 'episodes' : 'chapters';
      fields[unitKey] = 'canonicalTitle,thumbnail';
    }

    return fields;
  }
});
