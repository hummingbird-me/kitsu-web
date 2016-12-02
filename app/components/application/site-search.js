import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { task, timeout } from 'ember-concurrency';
import jQuery from 'jquery';

const typeTask = () => (
  task(function* (type, key, query, limit = 2) {
    return yield get(this, 'getData').perform(type, key, query, limit);
  }).restartable()
);

export default Ember.Component.extend({
  isOpened: false,
  query: undefined,

  metrics: service(),
  store: service(),

  animeTask: typeTask(),
  mangaTask: typeTask(),
  usersTask: typeTask(),

  inputClass: computed('isOpened', {
    get() {
      return `site-search__input ${get(this, 'isOpened') ? 'active' : ''}`;
    }
  }).readOnly(),

  getData: task(function* (type, key, query, limit) {
    return yield get(this, 'store').query(type, {
      filter: { [key]: query },
      page: { limit }
    });
  }).keepLatest().maxConcurrency(3),

  search: task(function* (query) {
    if (get(this, 'query') === query) { return; }
    yield timeout(250);
    get(this, 'animeTask').perform('anime', 'text', query).then(data => set(this, 'groups.anime', data));
    get(this, 'mangaTask').perform('manga', 'text', query).then(data => set(this, 'groups.manga', data));
    get(this, 'usersTask').perform('user', 'query', query).then(data => set(this, 'groups.users', data));
    set(this, 'query', query);
    get(this, 'metrics').trackEvent({ category: 'search', action: 'query', label: query });
  }).restartable(),

  init() {
    this._super(...arguments);
    set(this, 'groups', { anime: [], manga: [], users: [] });
  },

  didInsertElement() {
    this._super(...arguments);
    jQuery(document.body).on('click.search', (event) => {
      const target = get(event, 'target');
      const id = `#${get(this, 'elementId')}`;
      const isChild = jQuery(target).is(`${id} *, ${id}`);
      const isPopover = jQuery(target).is('#search-popover *, #search-popover');
      if (isChild === true || isPopover === true) {
        if (isChild === true) { this.$('input').focus(); }
        return;
      }
      set(this, 'isOpened', false);
    });
  },

  willDestroyElement() {
    jQuery(document.body).off('click.search');
  },

  actions: {
    close() {
      set(this, 'isOpened', false);
    },

    updatePage(type, records, links) {
      const content = get(this, `groups.${type}`).toArray();
      content.addObjects(records);
      set(content, 'links', links);
      set(this, `groups.${type}`, content);
    }
  }
});
