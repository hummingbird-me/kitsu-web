import Base from 'client/models/base';
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
  mediaRelationships: hasMany('media-relationship'),
  reviews: hasMany('review'),

  unitCount: or('episodeCount', 'chapterCount'),
  computedTitle: computed('session.account.titleLanguagePreference', 'titles', {
    get() {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'canonicalTitle');
      }
      const preference = get(this, 'session.account.titleLanguagePreference').toLowerCase();
      const key = getTitleField(preference);
      return key !== undefined ? get(this, `titles.${key}`) || get(this, 'canonicalTitle') :
        get(this, 'canonicalTitle');
    }
  }).readOnly()
});
