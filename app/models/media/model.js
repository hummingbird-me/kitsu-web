import computed from 'ember-computed';
import get from 'ember-metal/get';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  abbreviatedTitles: attr('array'),
  averageRating: attr('number'),
  canonicalTitle: attr('string'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  coverImageTopOffset: attr('number'),
  endDate: attr('date'),
  posterImage: attr('object', { defaultValue: '/images/default_poster.jpg' }),
  ratingFrequencies: attr('object'),
  slug: attr('string'),
  startDate: attr('date'),
  synopsis: attr('string'),
  titles: attr('object'),

  genres: hasMany('genre'),

  mergedTitles: computed('titles', {
    get() {
      let titles = get(this, 'titles');
      titles = Object.values(titles);
      return titles.map((x) => x.toLowerCase()).join('');
    }
  }).readOnly()
});
