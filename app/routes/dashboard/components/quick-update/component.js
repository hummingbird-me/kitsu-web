import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';
import { capitalize } from 'ember-string';
import observer from 'ember-metal/observer';

export default Component.extend({
  classNames: ['quick-update'],
  filter: 'anime',
  session: service(),
  store: service(),

  filterOptions: computed('filter', {
    get() {
      return ['anime', 'manga'].removeObject(get(this, 'filter'));
    }
  }).readOnly(),

  remaining: computed('initialEntries.length', {
    get() {
      return 3 - (get(this, 'initialEntries.length') || 0);
    }
  }).readOnly(),

  getEntriesTask: task(function* () {
    return yield get(this, 'store').query('library-entry', {
      include: 'media',
      filter: {
        media_type: capitalize(get(this, 'filter')),
        user_id: get(this, 'session.account.id'),
        status: '1,2'
      },
      sort: 'status,-updated_at',
      page: { limit: 12 }
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
    if (get(this, 'carousel') !== undefined) {
      get(this, 'carousel').flickity('destroy');
    }
  },

  _getEntries() {
    get(this, 'getEntriesTask').perform().then((entries) => {
      set(this, 'initialEntries', entries);
      scheduleOnce('afterRender', () => {
        set(this, 'carousel', this.$('.carousel').flickity(this._options()));
      });
    });
  },

  _appendToFlickty() {
    scheduleOnce('afterRender', () => (
      get(this, 'carousel').flickity('append', this.$('.new-entries').children())
    ));
  },

  _options() {
    return {
      cellAlign: 'left',
      contain: false,
      pageDots: false,
      groupCells: 2,
      autoPlay: false
    };
  },

  actions: {
    updateNextPage(records, links) {
      set(this, 'newEntries', records);
      set(this, 'initialEntries.links', links);
      this._appendToFlickty();
    }
  }
});
