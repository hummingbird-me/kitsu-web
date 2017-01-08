import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { or } from 'ember-computed';

export default Base.extend({
  session: service(),

  abbreviatedTitles: attr('array'),
  averageRating: attr('number'),
  canonicalTitle: attr('string'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  coverImageTopOffset: attr('number'),
  endDate: attr('utc'),
  posterImage: attr('object', { defaultValue: '/images/default_poster.jpg' }),
  ratingFrequencies: attr('object'),
  slug: attr('string'),
  startDate: attr('utc'),
  subtype: attr('string'),
  synopsis: attr('string'),
  titles: attr('object'),

  genres: hasMany('genre'),
  castings: hasMany('casting'),
  installments: hasMany('installment'),
  reviews: hasMany('review'),

  unitCount: or('episodeCount', 'chapterCount'),
  computedTitle: computed('session.account.titleLanguagePreference', 'titles', {
    get() {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'canonicalTitle');
      }
      const preference = get(this, 'session.account.titleLanguagePreference').toLowerCase();
      switch (preference) {
        case 'english':
          return get(this, 'titles.en') || get(this, 'canonicalTitle');
        case 'romanized':
          return get(this, 'titles.en_jp') || get(this, 'canonicalTitle');
        default:
          return get(this, 'canonicalTitle');
      }
    }
  }).readOnly()
});
