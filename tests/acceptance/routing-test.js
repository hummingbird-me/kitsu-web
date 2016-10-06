import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'client/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Routing');

test('visiting `/dashboard` redirects to `/`', function(assert) {
  assert.expect(1);
  visit('/dashboard');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/` works when unauthenticated', function(assert) {
  assert.expect(1);
  invalidateSession(this.application);
  visit('/');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting an unknown route redirects to `/404`', function(assert) {
  assert.expect(2);
  visit('/doesnt-exist');
  andThen(() => assert.equal(currentRouteName(), 'not-found'));
  andThen(() => assert.equal(currentURL(), '/404'));
});
