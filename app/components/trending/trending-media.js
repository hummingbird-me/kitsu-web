import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import FlickityActionsMixin from 'client/mixins/flickity-actions';

export default BaseComponent.extend(FlickityActionsMixin, {
  classNames: ['weekly-trending'],
  currentTab: 'anime',
  ajax: service(),
  store: service(),

  getDataTask: task(function* (type) {
    return yield get(this, 'ajax').request(`/trending/${type}`).then((response) => {
      // push into store since this is a regular AJAX request
      const records = [];
      response.data.forEach((data) => {
        const normalize = get(this, 'store').normalize(type, data);
        const record = get(this, 'store').push(normalize);
        records.addObject(record);
      });
      return records;
    });
  }).restartable()
});
