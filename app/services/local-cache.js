import Service from '@ember/service';
import { get } from '@ember/object';
import { storageFor } from 'ember-local-storage';

export default Service.extend({
  localCache: storageFor('local-cache'),

  /**
   * Builds a cache object of:
   *  type: { key: value }
   *
   * @param {String} type
   * @param {String} key
   * @param {any} value
   */
  addToCache(type, key, value) {
    const exists = get(this, 'localCache').get(type);
    if (!exists) {
      get(this, 'localCache').set(type, {});
    }
    get(this, 'localCache').set(`${type}.${key}`, value);
  },

  /**
   * Retrieves a value from the local cache.
   *
   * @param {String} type
   * @param {String} key
   * @returns {any|null}
   */
  getFromCache(type, key) {
    const typeCache = get(this, 'localCache').get(type);
    if (!typeCache) { return null; }
    return get(typeCache, key);
  }
});
