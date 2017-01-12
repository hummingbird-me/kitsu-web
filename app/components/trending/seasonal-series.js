import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';

/**
 * TODO:
 *
 * This component is currently using hardcoded seasons. It should be changed in the future
 * to determine what the current season is and the previous 3 season.
 */
export default BaseComponent.extend({
  classNames: ['seasonal-series'],
  currentTab: 'winter',
  store: service(),

  getDataTask: task(function* (type) {
    return yield get(this, 'store').query('anime', {
      filter: {
        year: 2017,
        season: type
      },
      sort: '-user_count',
      page: { limit: 10 }
    });
  }).restartable()
});
