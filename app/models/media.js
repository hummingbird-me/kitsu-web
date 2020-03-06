import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { get, computed } from '@ember/object';
import { or, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { getComputedTitle } from 'client/utils/get-title-field';

export default Base.extend({
  session: service(),
  intl: service(),

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
  episodes: hasMany('episode', { inverse: 'media' }),
  shouldShowAds: alias('nsfw'),

  unitCount: or('episodeCount', 'chapterCount'),
  computedTitle: computed('session.account.titleLanguagePreference', 'titles', function() {
    return getComputedTitle(get(this, 'session'), this);
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

  titlesSorted: computed('titles', function() {
    const data = get(this, 'titles');
    const titlesArray = Object.keys(data).map(code => ({ code, value: data[code] }));
    const collator = new Intl.Collator(this.intl.primaryLocale || 'en', { numeric: true, sensitivity: 'base' });
    const translateCode = code => this.intl.t(`media.show.summary.titles.${code}`, code);
    titlesArray.sort((a, b) => collator.compare(translateCode(a.code), translateCode(b.code)));
    return titlesArray;
  }).readOnly()
});
