import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { get, computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
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
  nsfw: attr('boolean'),
  popularityRank: attr('number'),
  posterImage: attr('object', { defaultValue: '/images/default_poster.jpg' }),
  ratingFrequencies: attr('object'),
  ratingRank: attr('number'),
  slug: attr('string'),
  startDate: attr('utc'),
  status: attr('string'),
  subtype: attr('string'),
  synopsis: attr('string'),
  tba: attr('string'),
  titles: attr('object'),

  castings: hasMany('casting'),
  categories: hasMany('category'),
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

  year: computed('startDate', function() {
    const startDate = get(this, 'startDate');
    return startDate ? get(this, 'startDate').year() : '';
  }).readOnly(),

  yearlessTitle: computed('computedTitle', function() {
    const title = get(this, 'computedTitle');
    return title.replace(/\(\d{4}\)$/, '');
  }).readOnly(),

  totalRatings: computed('ratingFrequencies', function() {
    // eslint-disable-next-line
    const keys = Array.apply(null, { length: 19 }).map(Number.call, Number).map(num => num + 2);
    const freqs = get(this, 'ratingFrequencies');
    return keys.reduce((prev, curr) => (
      prev + (parseInt(freqs[curr], 10) || 0)
    ), 0);
  }).readOnly(),
});
