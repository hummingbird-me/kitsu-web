import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: 'section',
  classNames: ['trending-banner'],
  ajax: service(),
  store: service(),

  getTrendingMedia: task(function* () {
    return yield get(this, 'ajax').request('/trending/anime?in_network=true').then((response) => {
      // push into store since this is a regular AJAX request
      const records = [];
      response.data.forEach((data) => {
        const normalize = get(this, 'store').normalize('anime', data);
        const record = get(this, 'store').push(normalize);
        records.addObject(record);
      });
      // TODO: Remove when server API limit works
      return records.slice(0, 8);
    }).catch((error) => {
      get(this, 'raven').logException(error);
    });
  }).drop(),

  init() {
    this._super(...arguments);
    const taskInstance = get(this, 'getTrendingMedia').perform();
    set(this, 'taskInstance', taskInstance);
  }
});
