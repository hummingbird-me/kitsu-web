import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'client/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Routing');

test('visiting `/dashboard` redirects to `/`', async function(assert) {
  server.create('user');
  authenticateSession(this.application);
  await visit('/dashboard');
  assert.equal(currentURL(), '/');
});

test('visiting `/` as a guest redirects to explore', async function(assert) {
  invalidateSession(this.application);
  await visit('/');
  assert.equal(currentURL(), '/explore/anime');
});

test('visiting `/admin` redirects when unauthenticated', async function(assert) {
  invalidateSession(this.application);
  await visit('/admin');
  assert.equal(currentURL(), '/explore/anime');
});

test('visiting `/settings/*` when unauthenticated redirects', async function(assert) {
  invalidateSession(this.application);
  await visit('/settings/profile');
  assert.equal(currentURL(), '/explore/anime');
});

test('visiting `/notifications` when unauthenticated redirects', async function(assert) {
  invalidateSession(this.application);
  await visit('/notifications');
  assert.equal(currentURL(), '/explore/anime');
});

test('visiting /password-reset redirects when authenticated', async function(assert) {
  server.create('user');
  authenticateSession(this.application);
  await visit('/password-reset');
  assert.equal(currentURL(), '/');
});

test('visiting an unknown route redirects to `/404`', async function(assert) {
  await visit('/doesnt-exist');
  assert.equal(currentRouteName(), 'not-found');
  assert.equal(currentURL(), '/404');
});
