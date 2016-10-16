import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';

export default Component.extend({
  session: service(),
  store: service(),

  remaining: computed('entries.length', {
    get() {
      return 4 - (get(this, 'entries.length') || 0);
    }
  }).readOnly(),

  getEntriesTask: task(function *() {
    const items = yield get(this, 'store').query('library-entry', {
      include: 'media',
      filter: {
        media_type: 'Anime,Manga',
        user_id: get(this, 'session.account.id'),
        status: '1,2'
      },
      sort: 'status,updated_at',
      page: { limit: 10 }
    });
    set(this, 'entries', items);
  }).cancelOn('willDestroyElement').drop(),

  didInsertElement() {
    this._super(...arguments);
    get(this, 'getEntriesTask').perform().then(() => {
      scheduleOnce('afterRender', () => {
        set(this, 'carousel', this.$().flickity(this._options()));
      });
    });
  },

  willDestroyelement() {
    this._super(...arguments);
    if (get(this, 'carousel') !== undefined) {
      get(this, 'carousel').flickity('destroy');
    }
  },

  _options() {
    return {
      cellAlign: 'center',
      contain: true,
      pageDots: false,
      groupCells: false,
      autoPlay: 1500
    }
  }
});
