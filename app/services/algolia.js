import { get, set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
import algoliasearch from 'algoliasearch';
import config from 'client/config/environment';

export default Service.extend({
  ajax: service(),
  queryCache: service(),
  indices: {},

  loadKeys() {
    return get(this, '_loadKeysTask').perform();
  },

  getIndex: task(function* (name) {
    const indices = get(this, 'indices');
    if (get(indices, name)) {
      return get(indices, name);
    }
    const keys = yield this.loadKeys();
    const info = get(keys, name);
    // bad response for keys?
    if (isEmpty(info)) {
      return null;
    }
    const client = algoliasearch(config.algolia.appId, info.key);
    const index = client.initIndex(info.index);
    set(this, `indices.${name}`, index);
    return index;
  }),

  _loadKeysTask: task(function* () {
    // check cache for early exit
    const cache = yield get(this, 'queryCache').get('algolia', '/algolia-keys', false);
    if (cache) {
      return cache;
    }

    // request and store in cache
    const records = yield get(this, 'ajax').request('/algolia-keys');
    // only push to cache if it isn't a bad response
    if (Object.keys(records).length > 0) {
      get(this, 'queryCache').push('algolia', '/algolia-keys', records);
    }
    return records;
  }).drop()
});
