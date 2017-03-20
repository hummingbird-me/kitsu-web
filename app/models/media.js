import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { or } from 'ember-computed';
import getTitleField from 'client/utils/get-title-field';

export default Base.extend({
  session: service(),

  abbreviatedTitles: attr('array'),
  averageRating: attr('number'),
  canonicalTitle: attr('string'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  coverImageTopOffset: attr('number'),
  endDate: attr('utc'),
  favoritesCount: attr('number'),
  popularityRank: attr('number'),
  posterImage: attr('object', { defaultValue: '/images/default_poster.jpg' }),
  ratingFrequencies: attr('object'),
  ratingRank: attr('number'),
  slug: attr('string'),
  startDate: attr('utc'),
  subtype: attr('string'),
  synopsis: attr('string'),
  titles: attr('object'),

  castings: hasMany('casting'),
  genres: hasMany('genre'),
  mediaRelationships: hasMany('media-relationship', { inverse: 'source' }),
  reviews: hasMany('review'),

  unitCount: or('episodeCount', 'chapterCount'),
  computedTitle: computed('session.account.titleLanguagePreference', 'titles', function() {
    if (!get(this, 'session.hasUser')) {
      return get(this, 'canonicalTitle');
    }
    const preference = get(this, 'session.account.titleLanguagePreference').toLowerCase();
    const key = getTitleField(preference);
    return key !== undefined ? get(this, `titles.${key}`) || get(this, 'canonicalTitle') :
      get(this, 'canonicalTitle');
  }).readOnly(),

  totalRatings: computed('ratingFrequencies', function() {
    const keys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const freqs = get(this, 'ratingFrequencies');
    return keys.reduce((prev, curr) => {
      const decimal = curr.toFixed(1).toString();
      return prev + (parseInt(freqs[decimal], 10) || 0);
    }, 0);
  }).readOnly(),

  season: computed('startDate', function() {
    const start = get(this, 'startDate');
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
    const start = get(this, 'startDate');
    const year = start.year();
    const month = start.month();
    if (season === 'winter' && month === 12) {
      return year + 1;
    }
    return year;
  }).readOnly(),

  airingStatus: computed('startDate', 'endDate', 'unitCount', function() {
    const start = get(this, 'startDate');
    const end = get(this, 'endDate');
    if (!start) { return null; }
    if (start.isBefore() || start.isSame()) {
      const isOneDay = get(this, 'unitCount') === 1;
      const isPastDay = end && (end.isBefore() || end.isSame());
      return (isOneDay || isPastDay) ? 'finished' : 'current';
    }
    const currentDate = moment();
    const futureDate = moment().add(3, 'months');
    const isSoon = start.isBetween(currentDate, futureDate);
    return isSoon ? 'upcoming' : 'nya';
  }).readOnly()
});
