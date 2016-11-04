import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'client/tests/helpers/ember-test-selectors';
import Pretender from 'pretender';
import JaQuery from 'client/tests/ember-ja-query';
import { arrayResponse as animeResponse } from 'client/tests/responses/anime';
import { arrayResponse as genresResponse } from 'client/tests/responses/genre';
import { arrayResponse as streamersResponse } from 'client/tests/responses/streamer';
import { arrayResponse as usersResponse } from 'client/tests/responses/user';
import { objectResponse as libraryResponse } from 'client/tests/responses/library-entry';
import { jsonFactory as json } from 'client/tests/helpers/json';

moduleForAcceptance('Acceptance | Anime', {
  beforeEach() {
    this.server = new Pretender(function() {
      this.get('/api/edge/feeds/notifications/1', json(200, { data: [] }));
      this.get('/api/edge/anime', json(200, new JaQuery(animeResponse).unwrap()));
      this.get('/api/edge/feeds/media_aggr/Anime-1', json(200, { data: [] }));
    });
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('anime.index requests and renders the correct data', function(assert) {
  this.server.get('/api/edge/genres', json(200, new JaQuery(genresResponse).unwrap()));
  this.server.get('/api/edge/streamers', json(200, new JaQuery(streamersResponse).unwrap()));

  visit('/anime');
  andThen(() => {
    const media = find(testSelector('selector', 'media-poster'));
    const genres = find(testSelector('selector', 'filter-genre'));
    const streamers = find(testSelector('selector', 'filter-streamer'));

    assert.equal(media.length, 2);
    assert.equal(genres.length, 4);
    assert.equal(streamers.length, 3);
  });
});

test('anime.show requests and renders the correct data', function(assert) {
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
  this.server.get('/api/edge/users', json(200, new JaQuery(usersResponse).unwrap()));
  this.server.get('/api/edge/library-entries', json(200, { data: [] }));
  this.server.post('/api/edge/library-entries', json(201, new JaQuery(libraryResponse).unwrap()));

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
