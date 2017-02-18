import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import observer from 'ember-metal/observer';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const typeTask = () => (
  task(function* (type, key, query, limit = 2) {
    return yield get(this, 'getData').perform(type, key, query, limit);
  }).restartable()
);

export default Component.extend({
  isOpened: false,
  query: undefined,
  metrics: service(),
  store: service(),
  animeTask: typeTask(),
  mangaTask: typeTask(),
  usersTask: typeTask(),

  getData: task(function* (type, key, query, limit) {
    return yield get(this, 'store').query(type, {
      filter: { [key]: query },
      page: { limit }
    });
  }).keepLatest().maxConcurrency(3),

  search: task(function* (query) {
    yield timeout(250);
    // TODO: Report to sentry
    get(this, 'animeTask').perform('anime', 'text', query).then((data) => {
      set(this, 'groups.anime', data);
    }).catch(() => {});
    get(this, 'mangaTask').perform('manga', 'text', query).then((data) => {
      set(this, 'groups.manga', data);
    }).catch(() => {});
    get(this, 'usersTask').perform('user', 'query', query).then((data) => {
      set(this, 'groups.users', data);
    }).catch(() => {});
  }).restartable(),

  init() {
    this._super(...arguments);
    set(this, 'groups', { anime: [], manga: [], users: [] });
  },

  _watchQuery: observer('query', function() {
    const query = get(this, 'query');
    if (isEmpty(query)) {
      return;
    }
    get(this, 'search').perform(query).then(() => {
      get(this, 'metrics').trackEvent({ category: 'search', action: 'query', label: query });
    }).catch(() => {});
  }),

  actions: {
    close() {
      set(this, 'isOpened', false);
      invokeAction(this, 'onClose');
    },

    updatePage(records) {
      const dup = get(this, 'groups.users').toArray().addObjects(records);
      set(this, 'groups.users', dup);
      set(this, 'groups.users.links', get(records, 'links'));
    }
  }
});
