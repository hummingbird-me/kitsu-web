import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'client/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Routing');

test('visiting `/dashboard` redirects to `/`', function(assert) {
  visit('/dashboard');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/` works when unauthenticated', function(assert) {
  invalidateSession(this.application);
  visit('/');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/admin` redirects when unauthenticated', function(assert) {
  invalidateSession(this.application);
  visit('/admin');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/settings/*` when unauthenticated redirects', function(assert) {
  invalidateSession(this.application);
  visit('/settings/profile');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting `/notifications` when unauthenticated redirects', function(assert) {
  invalidateSession(this.application);
  visit('/notifications');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting /password-reset redirects when authenticated', function(assert) {
  server.create('user');
  authenticateSession(this.application);
  visit('/password-reset');
  andThen(() => assert.equal(currentURL(), '/'));
});

test('visiting an unknown route redirects to `/404`', function(assert) {
  visit('/doesnt-exist');
  andThen(() => assert.equal(currentRouteName(), 'not-found'));
  andThen(() => assert.equal(currentURL(), '/404'));
});
