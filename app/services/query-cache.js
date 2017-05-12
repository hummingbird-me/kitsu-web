import Service from 'ember-service';
import get from 'ember-metal/get';
import service from 'ember-service/inject';

const CACHE_TIME = 2;

export default Service.extend({
  store: service(),

  init() {
    this._super(...arguments);
    this.cache = {};
  },

  /**
   * Attempts to use cached results so we don't execute to the API for every request.
   *
   * @param {String} type Ember Data Model Type
   * @param {Object} query Request Options
   */
  queryRecord(type, query) {
    const task = () => get(this, 'store').queryRecord(type, query);
    return this._getCachedQuery(type, query, task);
  },

  /**
   * Attempt to get a cached result if it exists and is within the expiry time, otherwise
   * execute the request and cache the results.
   *
   * @param {String} type Ember Data Model Type
   * @param {Object} query Request Options
   * @param {Function} task
   * @private
   */
  _getCachedQuery(type, query, task) {
    const cache = this.cache[type] || (this.cache[type] = {});
    const queryAsString = this._stringifyQuery(query);

    // Attempt to get the cached result
    const cachedResult = cache[queryAsString];
    if (cachedResult) {
      if (this._isExpired(cachedResult)) {
        delete cache[queryAsString];
      } else {
        return cachedResult.promise;
      }
    }

    // Execute the task (API Request), cache and return the results.
    const promise = task();
    return promise.then((records) => {
      cache[queryAsString] = { promise, expiry: this._getExpiryDate() };
      return records;
    }).catch(() => ({}));
  },

  /**
   * Returns a stringified sorted version of an object. This is so regardless of how you
   * build your request query, it is cached correctly with sorting.
   *
   * @param {Object} query
   * @private
   */
  _stringifyQuery(query) {
    const sortedObject = Object.keys(query).sort().reduce((previous, current) => (
      previous[current] = query[current] // eslint-disable-line
    ), {});
    return JSON.stringify(sortedObject);
  },

  /**
   * Create a date 2 hours in the future.
   *
   * @private
   */
  _getExpiryDate() {
    const date = new Date();
    date.setTime(date.getTime() + (CACHE_TIME * 60 * 60 * 1000));
    return date;
  },

  /**
   * Determines if the expiry date is older than the current time.
   *
   * @param {Object} cachedResult
   * @private
   */
  _isExpired(cachedResult) {
    return (new Date()) > cachedResult.expiry;
  }
});
