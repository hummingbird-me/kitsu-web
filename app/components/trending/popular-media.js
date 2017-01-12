import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import moment from 'moment';

export default BaseComponent.extend({
  classNames: ['annual-trending'],
  currentTab: 'anime',
  lastYear: moment().year() - 1,
  store: service(),

  getDataTask: task(function* (type) {
    return yield get(this, 'store').query(type, {
      sort: '-user_count',
      page: { limit: 10 }
    });
  }).restartable()
});
