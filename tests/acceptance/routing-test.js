import { module, test } from 'qunit';
import { visit, currentURL, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Routing', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting `/dashboard` redirects to `/`', async function(assert) {
    assert.expect(1);
    server.create('user');
    await authenticateSession();
    await visit('/dashboard');
    assert.equal(currentURL(), '/');
  });

  test('visiting `/` as a guest redirects to explore', async function(assert) {
    assert.expect(1);
    await invalidateSession();
    await visit('/');
    assert.equal(currentURL(), '/explore/anime');
  });

  test('visiting `/admin` redirects when unauthenticated', async function(assert) {
    assert.expect(1);
    await invalidateSession();
    await visit('/admin');
    assert.equal(currentURL(), '/explore/anime');
  });

  test('visiting `/settings/*` when unauthenticated redirects', async function(assert) {
    assert.expect(1);
    await invalidateSession();
    await visit('/settings/profile');
    assert.equal(currentURL(), '/explore/anime');
  });

  test('visiting `/notifications` when unauthenticated redirects', async function(assert) {
    assert.expect(1);
    await invalidateSession();
    await visit('/notifications');
    assert.equal(currentURL(), '/explore/anime');
  });

  test('visiting /password-reset redirects when authenticated', async function(assert) {
    assert.expect(1);
    server.create('user');
    await authenticateSession();
    await visit('/password-reset');
    assert.equal(currentURL(), '/');
  });
});
