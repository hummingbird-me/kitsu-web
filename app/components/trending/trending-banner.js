import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: 'section',
  classNames: ['trending-banner'],
  filterType: 'anime',
  filterOptions: ['anime', 'manga'],
  ajax: service(),
  store: service(),

  getTrendingMedia: task(function* (type) {
    return yield get(this, 'ajax').request(`/trending/${type}?in_network=true`).then((response) => {
      // push into store since this is a regular AJAX request
      const records = [];
      response.data.forEach((data) => {
        const normalize = get(this, 'store').normalize(type, data);
        const record = get(this, 'store').push(normalize);
        records.addObject(record);
      });
      // TODO: Remove when server API limit works
      return records.slice(0, 8);
    }).catch((error) => {
      get(this, 'raven').captureException(error);
    });
  }).restartable(),

  init() {
    this._super(...arguments);
    this._doRequest();
  },

  _doRequest() {
    const type = get(this, 'filterType');
    const taskInstance = get(this, 'getTrendingMedia').perform(type);
    set(this, 'taskInstance', taskInstance);
  },

  actions: {
    changeFilter(filter) {
      if (get(this, 'filterType') === filter) { return; }
      set(this, 'filterType', filter);
      this._doRequest();
    }
  }
});
