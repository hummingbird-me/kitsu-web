import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { modelType } from 'client/helpers/model-type';
import moment from 'moment';
import humanizeDuration from 'client/utils/humanize-duration';

const computedProduction = key => (
  computed('media.animeProductions', function() {
    const productions = get(this, 'media.animeProductions');
    return productions.filterBy('role', key).mapBy('producer.name').join(', ');
  }).readOnly()
);

export default Component.extend({
  tagName: 'section',
  classNames: ['media--information'],

  producers: computedProduction('producer'),
  licensors: computedProduction('licensor'),
  studios: computedProduction('studio'),

  isAnime: computed('media', function() {
    return modelType([get(this, 'media')]) === 'anime';
  }),

  isManga: computed('isAnime', function() {
    return !get(this, 'isAnime');
  }),

  season: computed('media.startDate', function() {
    const start = get(this, 'media.startDate');
    if (!start) { return null; }
    const month = moment(start).month() + 1;
    if ([12, 1, 2].includes(month)) {
      return 'winter';
    } else if ([3, 4, 5].includes(month)) {
      return 'spring';
    } else if ([6, 7, 8].includes(month)) {
      return 'summer';
    } else if ([9, 10, 11].includes(month)) {
      return 'fall';
    }
  }),

  seasonYear: computed('season', function() {
    const season = get(this, 'season');
    if (!season) { return null; }
    const start = get(this, 'media.startDate');
    const year = moment(start).year();
    const month = moment(start).month();
    if (season === 'winter' && month === 12) {
      return year + 1;
    }
    return year;
  }),

  airedLongerThanOneDay: computed('media.{startDate,endDate}', function() {
    return !get(this, 'media.startDate').isSame(get(this, 'media.endDate'));
  }),

  totalTime: computed('media.{episodeCount,episodeLength}', function() {
    const count = get(this, 'media.episodeCount');
    const length = get(this, 'media.episodeLength');
    const time = moment.duration(count * length, 'minutes');
    return humanizeDuration(time);
  }),

  /**
   * Returns keys used in our translation file.
   */
  airingStatus: computed('media.{startDate,endDate,unitCount}', function() {
    const start = get(this, 'media.startDate');
    const end = get(this, 'media.endDate');
    if (moment(start).isBefore() || moment(start).isSame()) {
      const isOneDay = get(this, 'media.unitCount') === 1;
      const isPastDate = moment(end).isBefore() || moment(end).isSame();
      return (isOneDay || isPastDate) ? 'finished' : 'current';
    }
    return 'nya';
  })
});
