import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import moment from 'moment';

export default BaseComponent.extend({
  classNames: ['annual-trending'],
  currentTab: 'anime',
  lastYear: moment().year() - 1,

  getDataTask: task(function* (type) {
    return yield get(this, 'store').query(type, {
      filter: { year: get(this, 'lastYear') },
      sort: '-average_rating',
      page: { limit: 10 }
    });
  }).restartable()
});
