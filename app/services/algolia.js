import { get, set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import algoliasearch from 'algoliasearch';
import config from 'client/config/environment';

export default Service.extend({
  ajax: service(),
  keys: {},
  indices: {},

  loadKeys() {
    if (get(this, 'loadKeysTask.performCount') > 0) return Promise.resolve();
    return get(this, 'loadKeysTask').perform();
  },

  loadKeysTask: task(function* () {
    const ajax = get(this, 'ajax');
    const keys = yield ajax.request('/algolia-keys', { method: 'GET' });
    set(this, 'keys', keys);
  }).drop(),

  getIndex: task(function* (name) {
    if (get(this, `indices.${name}`)) return get(this, `indices.${name}`);
    yield this.loadKeys();
    const info = get(this, `keys.${name}`);
    const client = algoliasearch(config.algolia.appId, info.key);
    const index = client.initIndex(info.index);
    set(this, `indices.${name}`, index);
    return index;
  })
});
