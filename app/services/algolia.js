import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task, waitForProperty } from 'ember-concurrency';
import algoliasearch from 'algoliasearch/dist/algoliasearchLite.min.js';
import config from 'client/config/environment';

export default Service.extend({
  keys: {},
  ajax: service(),

  getKeys: task(function* () {
    return yield this.ajax.request('algolia-keys');
  }).drop(),

  getIndex: task(function* (name) {
    if (this.keys[name]) {
      return this.keys[name];
    } else if (this.getKeys.isRunning) { // eslint-disable-line no-else-return
      yield waitForProperty(this, 'keys', k => Object.keys(k).length > 0);
    } else {
      const keys = yield this.getKeys.perform();
      this.set('keys', keys);
    }

    const info = this.keys[name];
    if (isEmpty(info)) { return null; }

    const client = algoliasearch(config.algolia.appId, info.key);
    const index = client.initIndex(info.index);
    this.keys[name] = index;
    return index;
  })
});
