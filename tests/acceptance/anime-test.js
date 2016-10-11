import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'client/tests/helpers/ember-test-selectors';
import JaQuery from 'client/tests/ember-ja-query';
import { arrayResponse as animeResponse } from 'client/tests/responses/anime';
import { arrayResponse as genresResponse } from 'client/tests/responses/genre';
import { arrayResponse as streamersResponse } from 'client/tests/responses/streamer';
import { arrayResponse as usersResponse } from 'client/tests/responses/user';
import { objectResponse as libraryResponse } from 'client/tests/responses/library-entry';

moduleForAcceptance('Acceptance | Anime', {
  afterEach() {
    if (this.server !== undefined) {
      this.server.shutdown();
    }
  }
});

test('anime.index requests and renders the correct data', function(assert) {
  this.server = new Pretender(function() {
    this.get('/api/edge/anime', function() {
      const data = new JaQuery(animeResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.get('/api/edge/genres', function() {
      const data = new JaQuery(genresResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.get('/api/edge/streamers', function() {
      const data = new JaQuery(streamersResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });
  });

  visit('/anime');
  andThen(() => {
    const media = find(testSelector('selector', 'media-poster'));
    const genres = find(testSelector('selector', 'filter-genre'));
    const streamers = find(testSelector('selector', 'filter-streamer'));

    assert.equal(media.length, 2);
    assert.equal(genres.length, 3);
    assert.equal(streamers.length, 3);
  });
});

test('anime.show requests and renders the correct data', function(assert) {
  this.server = new Pretender(function() {
    this.get('/api/edge/anime', function() {
      const data = new JaQuery(animeResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });
  });

  visit('/anime/trigun');
  andThen(() => {
    const data = new JaQuery(animeResponse);
    data.set('shouldUnwrapArrayMethods', false);
    const single = data.findBy('slug', 'trigun');
    const title = find(testSelector('selector', 'title'));
    assert.equal(title.text().trim(), single.get('attributes.canonicalTitle'));
  });
});

test('I should be able to create a library entry from anime.show', function(assert) {
  this.server = new Pretender(function() {
    this.get('/api/edge/anime', function() {
      const data = new JaQuery(animeResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.get('/api/edge/users', function() {
      const data = new JaQuery(usersResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.get('/api/edge/library-entries', function() {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ data: [] })];
    });

    this.post('/api/edge/library-entries', function() {
      const data = new JaQuery(libraryResponse);
      return [201, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });
  });

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
