import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const INDICES = {
  media: ['slug', 'canonicalTitle', 'titles', 'posterImage', 'kind', 'subtype', 'posterImage'],
  users: ['slug', 'name', 'avatar'],
  groups: ['slug', 'name', 'avatar'],
};

const search = (indexName, attributesToRetrieve) => (
  task(function* (query) {
    const index = yield get(this, 'algolia').indexFor(indexName);
    const response = yield index.search(query, { attributesToRetrieve, hitsPerPage: 2 });
    return get(response, 'hits');
  }).restartable()
);

export default Component.extend({
  isOpened: false,
  metrics: service(),
  algolia: service(),

  init() {
    this._super(...arguments);
    set(this, 'groups', { media: [], users: [], groups: [] });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    const query = get(this, 'query');
    if (isEmpty(query) || get(this, 'queryWas') === query) {
      return;
    }
    set(this, 'queryWas', query);
    get(this, 'searchTask').perform(query).then(() => {
      get(this, 'metrics').trackEvent({ category: 'search', action: 'query', label: query });
    }).catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  searchTask: task(function* (query) {
    Object.keys(INDICES).forEach((type) => {
      get(this, `${type}Task`).perform(query).then((records) => {
        set(this, `groups.${type}`, records);
      }).catch((error) => {
        get(this, 'raven').captureException(error);
      });
    });
    yield timeout(250);
  }).keepLatest(),

  mediaTask: search('media', INDICES.media),
  usersTask: search('users', INDICES.users),
  groupsTask: search('groups', INDICES.groups),

  actions: {
    close() {
      set(this, 'isOpened', false);
      invokeAction(this, 'onClose');
    },

    updatePage(records) {
      const copy = get(this, 'groups.users').toArray();
      copy.addObjects(records);
      set(copy, 'links', get(records, 'links'));
      set(this, 'groups.users', copy);
    }
  }
});
