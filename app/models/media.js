import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { or } from 'ember-computed';
import moment from 'moment';
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
    // eslint-disable-next-line
    const keys = Array.apply(null, { length: 19 }).map(Number.call, Number).map(num => num + 2);
    const freqs = get(this, 'ratingFrequencies');
    return keys.reduce((prev, curr) => (
      prev + (parseInt(freqs[curr], 10) || 0)
    ), 0);
  }).readOnly(),

  airingStatus: computed('startDate', 'endDate', 'unitCount', function() {
    const start = get(this, 'startDate');
    const end = get(this, 'endDate');
    if (!start) { return 'nya'; }
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
