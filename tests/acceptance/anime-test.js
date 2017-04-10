import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';

moduleForAcceptance('Acceptance | Anime');

test('can browse anime', function(assert) {
  server.createList('anime', 2);
  server.createList('genre', 4);
  server.createList('streamer', 3);

  visit('/anime');
  andThen(() => {
    const media = find(testSelector('selector', 'media-poster'));
    const genres = find(testSelector('selector', 'filter-genre'));
    const streamers = find(testSelector('selector', 'filter-streamer'));

    assert.equal(media.length, 2);
    assert.equal(genres.length, 4 + 1); // + 1 due to "ALL" button
    assert.equal(streamers.length, 3);
  });
});

test('can look at a single anime', function(assert) {
  server.create('anime', { canonicalTitle: 'Trigun', slug: 'trigun' });
  visit('/anime/trigun');

  andThen(() => {
    const title = find(testSelector('selector', 'title'));
    assert.equal(title.text().trim(), 'Trigun');
  });
});
