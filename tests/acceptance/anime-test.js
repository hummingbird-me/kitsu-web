import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';

moduleForAcceptance('Acceptance | Anime');

test('can browse anime', async function(assert) {
  server.createList('anime', 2);
  server.createList('category', 4);
  server.createList('streamer', 3);

  await visit('/anime');
  const media = find(testSelector('media-poster'));
  const categories = find(testSelector('filter-category'));
  const streamers = find(testSelector('filter-streamer'));

  assert.equal(media.length, 2);
  assert.equal(categories.length, 4);
  assert.equal(streamers.length, 3);
});

test('can look at a single anime', async function(assert) {
  server.create('anime', { canonicalTitle: 'Trigun', slug: 'trigun' });
  await visit('/anime/trigun');
  const title = find(testSelector('title'));
  assert.equal(title.text().trim(), 'Trigun');
});
