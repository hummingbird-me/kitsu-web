import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'client/tests/helpers/ember-simple-auth';
import Pretender from 'pretender';
import { jsonFactory as json } from 'client/tests/helpers/json';

moduleForAcceptance('Acceptance | Routing', {
  beforeEach() {
    this.server = new Pretender(function() {
      this.get('https://forums.hummingbird.me/c/industry-news.json', json(200, { data: [] }));
      this.get('/api/edge/feeds/global/global', json(200, { data: [] }));
    });
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('visiting `/dashboard` redirects to `/`', function(assert) {
  visit('/dashboard');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/` works when unauthenticated', function(assert) {
  invalidateSession(this.application);
  visit('/');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting an unknown route redirects to `/404`', function(assert) {
  visit('/doesnt-exist');
  andThen(() => assert.equal(currentRouteName(), 'not-found'));
  andThen(() => assert.equal(currentURL(), '/404'));
});
