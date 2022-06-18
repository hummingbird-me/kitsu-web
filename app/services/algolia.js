import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import algoliasearch from 'algoliasearch';
import config from 'client/config/environment';

export default Service.extend({
  keys: null,
  indices: {},
  ajax: service(),

  getKeys: task(function* () {
    if (this.keys) return this.keys;

    return set(this, 'keys', yield this.ajax.request('algolia-keys'));
  }).drop(),

  getIndex: task(function* (name) {
    yield this.getKeys.perform();

    if (this.indices[name]) return this.indices[name];

    const info = this.keys[name];
    if (isEmpty(info)) {
      return null;
    }

    const client = algoliasearch(config.algolia.appId, info.key);
    const index = client.initIndex(info.index);
    this.indices[name] = index;
    return index;
  })
});
