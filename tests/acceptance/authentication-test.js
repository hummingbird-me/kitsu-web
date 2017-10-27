import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { currentSession } from 'client/tests/helpers/ember-simple-auth';
import jQuery from 'jquery';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | Authentication', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();
    this.notify = this.application.__container__.lookup('service:notify');
  },

  afterEach() {
    jQuery('.modal-backdrop').remove();
    this.sandbox.restore();
  }
});

/**
 * Sign Up Tests
 */
test('can create an account', function(assert) {
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

  visit('/');
  click('[data-test-sign-up-header]');
  click('[data-test-sign-up-email]');
  fillIn('[data-test-username]', 'bob');
  fillIn('[data-test-email]', 'bob@acme.com');
  fillIn('[data-test-password]', 'password');
  click('[data-test-create-account]');
});

test('shows an error when using incorrect details on sign up', function(assert) {
  this.sandbox.stub(this.notify, 'error').callsFake((message) => {
    assert.equal(message, 'Email is already taken.');
  });
  server.post('/users', { errors: [{ detail: 'email is already taken.' }] }, 400);

  visit('/');
  click('[data-test-sign-up-header]');
  click('[data-test-sign-up-email]');
  fillIn('[data-test-username]', 'bob');
  fillIn('[data-test-email]', 'bob@acme.com');
  fillIn('[data-test-password]', 'password');
  click('[data-test-create-account]');
  andThen(() => {});
});

test('shows validation warnings on input fields', function(assert) {
  visit('/');
  click('[data-test-sign-up-header]');
  click('[data-test-sign-up-email]');

  fillIn('[data-test-username]', 'ab');
  andThen(() => {
    const error = find('[data-test-validation-username]');
    assert.equal(error.length, 1);
  });

  fillIn('[data-test-email]', 'bob@acme');
  andThen(() => {
    const error = find('[data-test-validation-email]');
    assert.equal(error.length, 1);
  });

  fillIn('[data-test-password]', 'nope');
  andThen(() => {
    const error = find('[data-test-validation-password]');
    assert.equal(error.length, 1);
  });
});

test('shows strength of password', function(assert) {
  visit('/');
  click('[data-test-sign-up-header]');
  click('[data-test-sign-up-email]');
  fillIn('[data-test-password]', 'password');
  andThen(() => {
    const element = find('[data-test-password-strength]');
    assert.equal(element.length, 1);
  });
});

/**
 * Sign In Tests
 */
test('can sign into an account', function(assert) {
  server.create('user', { name: 'bob', password: 'password' });

  visit('/');
  click('[data-test-sign-in-header]');
  fillIn('[data-test-identification]', 'bob');
  fillIn('[data-test-password]', 'password');
  click('[data-test-sign-in]');

  andThen(() => {});
  andThen(() => {
    const session = currentSession(this.application);
    assert.ok(session.get('isAuthenticated'));
  });
});

test('shows an error when using incorrect details on sign in', function(assert) {
  this.sandbox.stub(this.notify, 'error').callsFake((message) => {
    assert.equal(message, 'The provided credentials are invalid.');
  });
  server.post('http://localhost:7357/api/oauth/token', { error: 'invalid_grant' }, 400);

  visit('/');
  click('[data-test-sign-in-header]');
  fillIn('[data-test-identification]', 'bob');
  fillIn('[data-test-password]', 'not_password');
  click('[data-test-sign-in]');
  andThen(() => {});
});
