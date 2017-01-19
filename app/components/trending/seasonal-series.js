import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import FlickityActionsMixin from 'client/mixins/flickity-actions';

/**
 * TODO:
 *
 * This component is currently using hardcoded seasons. It should be changed in the future
 * to determine what the current season is and the previous 3 season.
 */
export default BaseComponent.extend(FlickityActionsMixin, {
  classNames: ['seasonal-series'],
  currentTab: 'winter',

  getDataTask: task(function* (type) {
    return yield get(this, 'store').query('anime', {
      filter: {
        season_year: this._getYear(),
        season: type
      },
      sort: '-user_count',
      page: { limit: 10 }
    });
  }).restartable(),

  _getYear() {
    const type = get(this, 'currentTab');
    return type === 'winter' ? 2017 : 2016;
  },

  actions: {
    getYear() {
      return this._getYear();
    }
  }
});
