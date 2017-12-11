import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

const DEFAULT_INCLUDED = ['id', 'slug', 'kind'];
const INDICES = {
  media: [...DEFAULT_INCLUDED, 'canonicalTitle', 'titles', 'posterImage', 'subtype', 'posterImage'],
  users: [...DEFAULT_INCLUDED, 'name', 'avatar'],
  groups: [...DEFAULT_INCLUDED, 'name', 'avatar'],
};

const search = (indexName, attributesToRetrieve) => (
  task(function* (query, options = {}) {
    const index = yield get(this, 'algolia').indexFor(indexName);
    return yield index.search(query, {
      attributesToRetrieve,
      hitsPerPage: 2,
      ...options
    });
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
      get(this, `${type}Task`).perform(query).then((response) => {
        const records = get(response, 'hits');
        set(this, `groups.${type}`, records);
        set(this, `groups.${type}.nbPages`, get(response, 'nbPages'));
      }).catch((error) => {
        get(this, 'raven').captureException(error);
      });
    });
    yield timeout(250);
  }).keepLatest(),

  mediaTask: search('media', INDICES.media),
  usersTask: search('users', INDICES.users),
  groupsTask: search('groups', INDICES.groups),

  nextPageTask: task(function* (kind, page) {
    const query = get(this, 'query');
    const response = yield get(this, `${kind}Task`).perform(query, { page });
    get(this, `groups.${kind}`).addObjects(get(response, 'hits'));
  }).drop(),

  actions: {
    close() {
      set(this, 'isOpened', false);
      invokeAction(this, 'onClose');
    }
  }
});
