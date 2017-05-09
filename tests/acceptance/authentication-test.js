import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { currentSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'ember-test-selectors';
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
  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'));
  fillIn(testSelector('selector', 'username'), 'bob');
  fillIn(testSelector('selector', 'email'), 'bob@acme.com');
  fillIn(testSelector('selector', 'password'), 'password');
  click(testSelector('selector', 'create-account'));

  andThen(() => {});
  andThen(() => {
    const session = currentSession(this.application);
    assert.ok(session.get('isAuthenticated'));
    assert.equal(server.db.users[0].email, 'bob@acme.com');
  });
});

test('shows an error when using incorrect details on sign up', function(assert) {
  this.sandbox.stub(this.notify, 'error').callsFake((message) => {
    assert.equal(message, 'Email is already taken.');
  });
  server.post('/users', { errors: [{ detail: 'email is already taken.' }] }, 400);

  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'));
  fillIn(testSelector('selector', 'username'), 'bob');
  fillIn(testSelector('selector', 'email'), 'bob@acme.com');
  fillIn(testSelector('selector', 'password'), 'password');
  click(testSelector('selector', 'create-account'));
  andThen(() => {});
});

test('shows validation warnings on input fields', function(assert) {
  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'));

  fillIn(testSelector('selector', 'username'), '1234');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-username'));
    assert.equal(error.length, 1);
  });

  fillIn(testSelector('selector', 'email'), 'bob@acme');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-email'));
    assert.equal(error.length, 1);
  });

  fillIn(testSelector('selector', 'password'), 'nope');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-password'));
    assert.equal(error.length, 1);
  });
});

test('shows strength of password', function(assert) {
  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'));
  fillIn(testSelector('selector', 'password'), 'password');
  andThen(() => {
    const element = find(testSelector('selector', 'password-strength'));
    assert.equal(element.length, 1);
  });
});

/**
 * Sign In Tests
 */
test('can sign into an account', function(assert) {
  server.create('user', { name: 'bob', password: 'password' });

  visit('/');
  click(testSelector('selector', 'sign-in-header'));
  fillIn(testSelector('selector', 'identification'), 'bob');
  fillIn(testSelector('selector', 'password'), 'password');
  click(testSelector('selector', 'sign-in'));

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
  click(testSelector('selector', 'sign-in-header'));
  fillIn(testSelector('selector', 'identification'), 'bob');
  fillIn(testSelector('selector', 'password'), 'not_password');
  click(testSelector('selector', 'sign-in'));
  andThen(() => {});
});
