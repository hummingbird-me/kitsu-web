import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import { modelType } from 'client/helpers/model-type';
import moment from 'moment';
/* global humanizeDuration */

const computedProduction = key => (
  getter(function() {
    const productions = get(this, 'media.animeProductions');
    return productions.filterBy('role', key).mapBy('producer.name').join(', ');
  })
);

export default Component.extend({
  tagName: 'section',
  classNames: ['media--information'],

  producers: computedProduction('producer'),
  licensors: computedProduction('licensor'),
  studios: computedProduction('studio'),

  isAnime: getter(function() {
    return modelType([get(this, 'media')]) === 'anime';
  }),

  isManga: getter(function() {
    return !get(this, 'isAnime');
  }),

  season: getter(function() {
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

  seasonYear: getter(function() {
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

  airedLongerThanOneDay: getter(function() {
    return !get(this, 'media.startDate').isSame(get(this, 'media.endDate'));
  }),

  totalTime: getter(function() {
    const count = get(this, 'media.episodeCount');
    const length = get(this, 'media.episodeLength');
    const time = moment.duration(count * length, 'minutes');
    return humanizeDuration(time.asMilliseconds(), { largest: 1 });
  }),

  /**
   * Returns keys used in our translation file.
   */
  airingStatus: getter(function() {
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
