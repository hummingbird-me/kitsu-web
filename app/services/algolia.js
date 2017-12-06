import { get, set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import algoliasearch from 'algoliasearch';
import config from 'client/config/environment';

export default Service.extend({
  ajax: service(),
  keys: {},

  loadKeys: task(function* () {
    const ajax = get(this, 'ajax');
    const keys = yield ajax.request('/algolia-keys', { method: 'GET' });
    set(this, 'keys', keys);
  }),

  async indexFor(name) {
    if (!get(this, `keys.${name}`)) await this.loadKeys.perform();
    const info = get(this, `keys.${name}`);
    const client = algoliasearch(config.algolia.appId, info.key);
    return client.initIndex(info.index);
  }
});
