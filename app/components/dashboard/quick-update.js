import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';
import { capitalize } from 'ember-string';
import observer from 'ember-metal/observer';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['quick-update'],
  filter: 'all',
  pageLimit: 12,

  notify: service(),
  session: service(),
  store: service(),

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

  _updateType: observer('filter', function() {
    this._getEntries();
  }),

  init() {
    this._super(...arguments);
    this._getEntries();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._clean();
  },

  _getEntries() {
    set(this, 'initialEntries', []);
    get(this, 'getEntriesTask').perform().then((entries) => {
      set(this, 'initialEntries', entries);
      this._clean();
      scheduleOnce('afterRender', () => {
        if (get(this, 'isDestroyed')) { return; }
        set(this, 'carousel', this.$('.carousel').flickity(this._options()));
      });
    }).catch(() => {});
  },

  _clean() {
    if (get(this, 'carousel') !== undefined) {
      get(this, 'carousel').flickity('destroy');
    }
  },

  _appendToFlickty() {
    scheduleOnce('afterRender', () => {
      if (get(this, 'isDestroyed')) { return; }
      const index = get(this, 'carousel').data('flickity').cells.length - 1;
      get(this, 'carousel').flickity('insert', this.$('.new-entries').children(), index);
    });
  },

  _options() {
    return {
      cellAlign: 'left',
      contain: false,
      pageDots: false,
      groupCells: 1,
      autoPlay: false
    };
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
  }
});
