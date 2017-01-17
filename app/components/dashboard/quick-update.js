import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';
import { capitalize } from 'ember-string';
import errorMessages from 'client/utils/error-messages';
import { storageFor } from 'ember-local-storage';

export default Component.extend({
  classNames: ['quick-update'],
  pageLimit: 12,
  notify: service(),
  session: service(),
  store: service(),
  lastUsed: storageFor('last-used'),

  filterOptions: computed('filter', {
    get() {
      return ['all', 'anime', 'manga'].removeObject(get(this, 'filter'));
    }
  }).readOnly(),

  remaining: computed('initialEntries.length', {
    get() {
      return 3 - (get(this, 'initialEntries.length') || 0);
    }
  }).readOnly(),

  getEntriesTask: task(function* () {
    const type = get(this, 'filter') === 'all' ? 'Anime,Manga' : capitalize(get(this, 'filter'));
    return yield get(this, 'store').query('library-entry', {
      include: 'media,nextUnit',
      filter: {
        media_type: type,
        user_id: get(this, 'session.account.id'),
        status: '1,2'
      },
      sort: 'status,-updated_at',
      page: { limit: get(this, 'pageLimit') }
    });
  }).drop(),

  init() {
    this._super(...arguments);
    const filter = get(this, 'lastUsed.quickUpdateFilter') || 'all';
    set(this, 'filter', filter);
    this._getEntries();
  },

  _getEntries() {
    set(this, 'initialEntries', []);
    get(this, 'getEntriesTask').perform().then((entries) => {
      set(this, 'initialEntries', entries);
    }).catch(() => {});
  },

  _appendToFlickty() {
    scheduleOnce('afterRender', () => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) { return; }
      const index = this.$('.carousel').data('flickity').cells.length - 1;
      this.$('.carousel').flickity('insert', this.$('.new-entries').children(), index);
    });
  },

  actions: {
    updateNextPage(records, links) {
      set(this, 'newEntries', records);
      set(this, 'initialEntries.links', links);
      this._appendToFlickty();
    },

    updateEntry(entry, property, value) {
      set(entry, property, value);
      return entry.save().catch((err) => {
        entry.rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    },

    changeFilter(option) {
      set(this, 'filter', option);
      set(this, 'lastUsed.quickUpdateFilter', option);
      this._getEntries();
    }
  }
});
