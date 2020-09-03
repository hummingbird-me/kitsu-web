import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  abbreviatedTitles: [],
  averageRating: 4.2,
  canonicalTitle: 'Kitsu The Anime',
  endDate() { return faker.date.future(); },
  ratingFrequencies: {
    0.5: 0,
    '1.0': 0,
    1.5: 0,
    '2.0': 0,
    2.5: 0,
    '4.0': 9000,
    4.5: 0,
    '5.0': 0
  },
  slug: 'kitsu-the-anime',
  status: 'tba',
  startDate() { return faker.date.past(); },
  subtype() { return faker.list.random('TV', 'Movie')(); },
  description() { return faker.lorem.paragraphs(); },
  titles: {
    en: 'Kitsu The Anime - Engish',
    en_jp: 'Kitsu The Anime',
  }
});
