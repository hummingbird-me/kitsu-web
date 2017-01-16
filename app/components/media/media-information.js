import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import moment from 'moment';
/* global humanizeDuration */

export default Component.extend({
  tagName: 'section',
  classNames: ['media--information'],

  season: getter(function() {
    const start = get(this, 'media.startDate');
    if (!start) { return null; }
    const month = moment(start).month();
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

  airingStatus: getter(function() {
    const start = get(this, 'media.startDate');
    const end = get(this, 'media.endDate');
    if (moment(start).isBefore() || moment(start).isSame()) {
      return (moment(end).isBefore() || moment(end).isSame()) ? 'Finished Airing' : 'Currently Airing';
    }
    return 'Not Yet Aired';
  })
});
