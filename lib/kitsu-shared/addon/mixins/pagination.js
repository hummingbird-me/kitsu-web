import Mixin from '@ember/object/mixin';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Route from '@ember/routing/route';
import { singularize } from 'ember-inflector';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Mixin.create({
  paginationKey: 'next',
  store: service(),
  queryCache: service(),

  hasNextPage: computed('internalPageState.hasNextPage', function() {
    return this._hasNextPage();
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.resetPageState();
  },

  queryPaginated(type, query, cacheOptions = { cache: true }) {
    // Cancel any on-going pagination tasks that might be using old data
    this.resetPageState();
    get(this, '_doPaginationRequestTask').cancelAll();
    set(this, 'cacheOptions', cacheOptions);
    return get(this, '_queryPaginatedTask').perform(...arguments);
  },

  updatePageState(records) {
    if (this instanceof Component && get(this, 'isDestroyed')) {
      return;
    }
    const key = get(this, 'paginationKey');
    const hasNextPage = key in (get(records, 'links') || {});
    set(this, 'internalPageState.hasNextPage', hasNextPage);
    set(this, 'internalPageState.nextPageLink', hasNextPage
      ? get(records, `links.${key}`) : null);
  },

  resetPageState() {
    set(this, 'paginatedRecords', []);
    set(this, 'internalPageState', {
      hasNextPage: false,
      nextPageLink: null
    });
  },

  onPagination(records) {
    if (this instanceof Route) {
      const controller = this.controllerFor(get(this, 'routeName'));
      get(controller, 'model.paginatedRecords').addObjects(records);
    } else {
      get(this, 'paginatedRecords').addObjects(records);
    }
  },

  actions: {
    onPagination(recordType, customOptions = {}) {
      return this._doPaginationRequest(recordType, customOptions);
    }
  },

  _doPaginationRequest(...args) {
    return get(this, '_doPaginationRequestTask').perform(...args);
  },

  _queryPaginatedTask: task(function* (...args) {
    const records = yield get(this, 'queryCache').query(...args);
    this.updatePageState(records);
    return records;
  }).keepLatest(),

  _doPaginationRequestTask: task(function* (recordType, customOptions = {}) {
    const hasNextPage = this._hasNextPage();
    if (!hasNextPage) { return RSVP.resolve(); }
    const options = Object.assign(this._getPaginationRequestOptions(), customOptions);
    const modelName = recordType || this._getPaginationRecordType();
    const cacheOptions = get(this, 'cacheOptions');
    const records = yield get(this, 'queryCache').query(modelName, options, cacheOptions);
    this.updatePageState(records);
    this.onPagination(records);
    return records;
  }).keepLatest(),

  _hasNextPage() {
    return get(this, 'internalPageState.hasNextPage');
  },

  _getPaginationRequestOptions() {
    const nextPageLink = get(this, 'internalPageState.nextPageLink');
    const decodedLink = window.decodeURI(nextPageLink);
    const splitLink = decodedLink.split('?');
    if (splitLink.length !== 2) {
      return {};
    }
    const queryParams = splitLink[1].split('&');
    const options = {};
    queryParams.forEach(param => {
      // eslint-disable-next-line prefer-const
      let [key, value] = param.split('=');
      if (key.includes('[')) {
        // eslint-disable-next-line no-unused-vars
        const [_, parent, child] = key.match(/(.+)\[(.+)\]/);
        options[parent] = options[parent] || {};
        options[parent][child] = decodeURIComponent(value);
      } else {
        options[key] = decodeURIComponent(value);
      }
    });
    return options;
  },

  _getPaginationRecordType() {
    const nextPageLink = get(this, 'internalPageState.nextPageLink');
    const decodedLink = window.decodeURI(nextPageLink);
    const [URL] = decodedLink.split('?');
    return singularize(get(URL.split('/'), 'lastObject'));
  }
});
