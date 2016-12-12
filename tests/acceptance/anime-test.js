import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'client/tests/helpers/ember-test-selectors';

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

test('can create a library entry from an anime page', function(assert) {
  server.create('anime', { canonicalTitle: 'Trigun', slug: 'trigun' });
  server.create('user');

  authenticateSession(this.application);
  visit('/anime/trigun');

  andThen(() => {
    const button = find(testSelector('selector', 'library-dropdown'));
    assert.equal(button.text().trim(), 'Add to Library');
  });

  click(testSelector('selector', 'library-dropdown'));
  click(`${testSelector('selector', 'library-dropdown-item')}:first-child`);

  andThen(() => {
    const button = find(testSelector('selector', 'library-dropdown'));
    assert.equal(button.text().trim(), 'Currently Watching');
  });
});
