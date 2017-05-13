import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import computed from 'ember-computed';
import { typeOf } from 'ember-utils';
import { task } from 'ember-concurrency';
import { scheduleOnce } from 'ember-runloop';
import { storageFor } from 'ember-local-storage';
import FlickityActionsMixin from 'client/mixins/flickity-actions';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(FlickityActionsMixin, Pagination, {
  classNames: ['quick-update'],
  filterOptions: ['all', 'anime', 'manga'],
  pageLimit: 12,
  notify: service(),
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

  getEntriesTask: task(function* () {
    const type = get(this, 'filter') !== 'all' ? get(this, 'filter') : undefined;
    const includes = type || 'anime,manga';
    return yield this.queryPaginated('library-entry', {
      include: `${includes},unit`,
      filter: {
        kind: type,
        user_id: get(this, 'session.account.id'),
        status: 'current,planned'
      },
      fields: this._getFieldsets(type),
      sort: 'status,-updated_at',
      page: { limit: get(this, 'pageLimit') }
    });
  }).drop(),

  onPagination() {
    this._super(...arguments);
    this._appendToFlickity();
  },

  actions: {
    updateEntry(entry, property, value) {
      if (get(this, 'isFlickityDraging')) { return; }
      if (typeOf(property) === 'object') {
        setProperties(entry, property);
      } else {
        set(entry, property, value);
      }
      return entry.save().catch(() => {
        entry.rollbackAttributes();
      });
    },

    reloadUnit(entry) {
      const idWas = get(entry, 'unit.id');
      return entry.belongsTo('unit').reload().then((unit) => {
        // if the id hasn't changed then that means the API returned a `null` value
        const value = get(unit, 'id') === idWas ? null : unit;
        set(entry, 'unit', value);
      }).catch(() => {
        set(entry, 'unit', null);
      });
    },

    changeFilter(option) {
      if (get(this, 'filter') === option) { return; }
      set(this, 'filter', option);
      set(this, 'lastUsed.quickUpdateFilter', option);
      this._getEntries();
    },

    sortEntries(a, b) {
      return get(a, 'updatedAt').isBefore(get(b, 'updatedAt'));
    }
  },

  _getEntries() {
    set(this, 'initialEntries', []);
    set(this, 'paginatedRecords', []);
    get(this, 'getEntriesTask').perform().then((entries) => {
      set(this, 'initialEntries', entries);
    }).catch((error) => {
      get(this, 'raven').captureException(error);
    });
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
      libraryEntries: ['progress', 'status', 'rating', 'unit', 'updatedAt']
    };

    if (type === undefined) {
      fields.libraryEntries.push('anime', 'manga');
      fields.anime = ['posterImage', 'canonicalTitle', 'titles', 'episodeCount', 'slug'].join(',');
      fields.manga = ['posterImage', 'canonicalTitle', 'titles', 'chapterCount', 'slug'].join(',');
    } else {
      fields.libraryEntries.push(type);
      const unitType = type === 'anime' ? 'episodeCount' : 'chapterCount';
      fields[type] = ['posterImage', 'canonicalTitle', 'titles', unitType, 'slug'].join(',');
    }
    fields.libraryEntries = fields.libraryEntries.join(',');

    const unitKey = type === 'anime' ? 'episodes' : undefined;
    if (unitKey) {
      fields[unitKey] = 'canonicalTitle';
    }

    return fields;
  }
});
