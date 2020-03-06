import { module, test } from 'qunit';
import { visit, click, fillIn, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import jQuery from 'jquery';
import sinon from 'sinon';

module('Acceptance | Authentication', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
    this.notify = this.owner.lookup('service:notify');
  });

  hooks.afterEach(function() {
    jQuery('.modal-backdrop').remove();
    this.sandbox.restore();
  });

  /**
   * Sign Up Tests
   */
  test('can create an account', async function(assert) {
    assert.expect(1);
    const done = assert.async();
    server.post('/users', (db, request) => {
      const data = JSON.parse(request.requestBody);
      assert.deepEqual(data, {
        data: {
          attributes: {
            name: 'bob',
            email: 'bob@acme.com',
            password: 'password'
          },
          type: 'users'
        }
      });
      done();
    }, 400);

    await visit('/');
    await click('[data-test-sign-up-header]');
    await click('[data-test-sign-up-email]');
    await fillIn('[data-test-username]', 'bob');
    await fillIn('[data-test-email]', 'bob@acme.com');
    await fillIn('[data-test-password]', 'password');
    await click('[data-test-create-account]');
  });

  test('shows an error when using incorrect details on sign up', async function(assert) {
    assert.expect(1);
    this.sandbox.stub(this.notify, 'error').callsFake((message) => {
      assert.equal(message, 'Email is already taken.');
    });
    server.post('/users', { errors: [{ detail: 'email is already taken.' }] }, 400);

    await visit('/');
    await click('[data-test-sign-up-header]');
    await click('[data-test-sign-up-email]');
    await fillIn('[data-test-username]', 'bob');
    await fillIn('[data-test-email]', 'bob@acme.com');
    await fillIn('[data-test-password]', 'password');
    await click('[data-test-create-account]');
  });

  test('shows validation warnings on input fields', async function(assert) {
    assert.expect(3);
    await visit('/');
    await click('[data-test-sign-up-header]');
    await click('[data-test-sign-up-email]');

    await fillIn('[data-test-username]', 'ab');
    let error = find('[data-test-validation-username]');
    assert.ok(error);

    await fillIn('[data-test-email]', 'bob@acme');
    error = find('[data-test-validation-email]');
    assert.ok(error);

    await fillIn('[data-test-password]', 'nope');
    error = find('[data-test-validation-password]');
    assert.ok(error);
  });

  test('shows strength of password', async function(assert) {
    assert.expect(1);
    await visit('/');
    await click('[data-test-sign-up-header]');
    await click('[data-test-sign-up-email]');
    await fillIn('[data-test-password]', 'password');
    const element = find('[data-test-password-strength]');
    assert.ok(element);
  });

  /**
   * Sign In Tests
   */
  test('can sign into an account', async function(assert) {
    assert.expect(1);
    server.create('user', { name: 'bob', password: 'password' });

    await visit('/');
    await click('[data-test-sign-in-header]');
    await fillIn('[data-test-identification]', 'bob');
    await fillIn('[data-test-password]', 'password');
    await click('[data-test-sign-in]');

    const session = currentSession();
    assert.ok(session.get('isAuthenticated'));
  });

  test('shows an error when using incorrect details on sign in', async function(assert) {
    assert.expect(1);
    this.sandbox.stub(this.notify, 'error').callsFake((message) => {
      assert.equal(message, 'The provided credentials are invalid.');
    });
    server.post('http://localhost:7357/api/oauth/token', { error: 'invalid_grant' }, 400);

    await visit('/');
    await click('[data-test-sign-in-header]');
    await fillIn('[data-test-identification]', 'bob');
    await fillIn('[data-test-password]', 'not_password');
    await click('[data-test-sign-in]');
  });
});
