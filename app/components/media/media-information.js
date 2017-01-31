import Component from 'ember-component';
import get from 'ember-metal/get';
import computed, { not } from 'ember-computed';
import humanizeDuration from 'client/utils/humanize-duration';
import moment from 'moment';

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
    return get(this, 'media.modelType') === 'anime';
  }).readOnly(),
  isManga: not('isAnime').readOnly(),

  season: computed('media.startDate', function() {
    const start = get(this, 'media.startDate');
    if (!start) { return null; }
    const month = start.month() + 1;
    if ([12, 1, 2].includes(month)) {
      return 'winter';
    } else if ([3, 4, 5].includes(month)) {
      return 'spring';
    } else if ([6, 7, 8].includes(month)) {
      return 'summer';
    } else if ([9, 10, 11].includes(month)) {
      return 'fall';
    }
  }).readOnly(),

  seasonYear: computed('season', function() {
    const season = get(this, 'season');
    if (!season) { return null; }
    const start = get(this, 'media.startDate');
    const year = start.year();
    const month = start.month();
    if (season === 'winter' && month === 12) {
      return year + 1;
    }
    return year;
  }).readOnly(),

  airedLongerThanOneDay: computed('media.{startDate,endDate}', function() {
    const start = get(this, 'media.startDate');
    if (!start) { return false; }
    return !start.isSame(get(this, 'media.endDate'));
  }).readOnly(),

  totalTime: computed('media.{episodeCount,episodeLength}', function() {
    const count = get(this, 'media.episodeCount');
    const length = get(this, 'media.episodeLength');
    const time = moment.duration(count * length, 'minutes');
    return humanizeDuration(time);
  }).readOnly(),

  /**
   * Returns keys used in our translation file.
   */
  airingStatus: computed('media.{startDate,endDate,unitCount}', function() {
    const start = get(this, 'media.startDate');
    const end = get(this, 'media.endDate');
    if (start && (start.isBefore() || start.isSame())) {
      const isOneDay = get(this, 'media.unitCount') === 1;
      const isPastDate = end && (end.isBefore() || end.isSame());
      return (isOneDay || isPastDate) ? 'finished' : 'current';
    }
    return 'nya';
  })
});
