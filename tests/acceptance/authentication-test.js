import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { currentSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'client/tests/helpers/ember-test-selectors';
import Pretender from 'pretender';
import jQuery from 'jquery';
import JaQuery from 'client/tests/ember-ja-query';
import {
  arrayResponse as usersResponse,
  objectResponse as singleUser
} from 'client/tests/responses/user';
import tokenResponse from 'client/tests/responses/token';
import { jsonFactory as json } from 'client/tests/helpers/json';

moduleForAcceptance('Acceptance | Authentication', {
  beforeEach() {
    jQuery('#ember-testing').append('<div id="wormhole"></div>');
    this.server = new Pretender(function() {
      this.post('/api/edge/users', json(201, new JaQuery(singleUser).unwrap()));
      this.get('/api/edge/users', json(200, new JaQuery(usersResponse).unwrap()));
    });
  },

  afterEach() {
    jQuery('.modal-backdrop').remove();
    this.server.shutdown();
  }
});

/**
 * Sign Up Tests
 */
test('can create an account', function(assert) {
  this.server.post('/api/oauth/token', json(201, tokenResponse));
  this.server.get('/api/edge/library-entries', json(200, { data: [] }));

  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'), '#wormhole');
  fillIn(testSelector('selector', 'username'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'email'), '#wormhole', 'bob@acme.com');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'password');
  click(testSelector('selector', 'create-account'), '#wormhole');

  andThen(() => {
    const session = currentSession(this.application);
    assert.ok(session.get('isAuthenticated'));
    assert.equal(session.get('account.name'), 'bob');
  });
});

test('shows an error when using incorrect details on sign up', function(assert) {
  this.server.post('/api/edge/users', json(400, { errors: [{ detail: 'email is already taken.' }] }));

  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'), '#wormhole');
  fillIn(testSelector('selector', 'username'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'email'), '#wormhole', 'bob@acme.com');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'password');
  click(testSelector('selector', 'create-account'), '#wormhole');

  andThen(() => {
    const error = find(testSelector('selector', 'error-message'), '#wormhole').text().trim();
    assert.equal(error, 'Email is already taken.');
  });
});

test('shows validation warnings on input fields', function(assert) {
  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'), '#wormhole');

  fillIn(testSelector('selector', 'username'), '#wormhole', '1234');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-username'), '#wormhole');
    assert.equal(error.length, 1);
  });

  fillIn(testSelector('selector', 'email'), '#wormhole', 'bob@acme');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-email'), '#wormhole');
    assert.equal(error.length, 1);
  });

  fillIn(testSelector('selector', 'password'), '#wormhole', 'nope');
  andThen(() => {
    const error = find(testSelector('selector', 'validation-password'), '#wormhole');
    assert.equal(error.length, 1);
  });
});

test('shows strength of password', function(assert) {
  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-up-email'), '#wormhole');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'password');
  andThen(() => {
    const element = find(testSelector('selector', 'password-strength'), '#wormhole');
    assert.equal(element.length, 1);
  });
});

/**
 * Sign In Tests
 */
test('can sign into an account', function(assert) {
  this.server.post('/api/oauth/token', json(200, tokenResponse));
  this.server.get('/api/edge/library-entries', json(200, { data: [] }));

  visit('/');
  click(testSelector('selector', 'sign-in-header'));
  fillIn(testSelector('selector', 'identification'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'password');
  click(testSelector('selector', 'sign-in'), '#wormhole');

  andThen(() => {
    const session = currentSession(this.application);
    assert.ok(session.get('isAuthenticated'));
  });
});

test('shows an error when using incorrect details on sign in', function(assert) {
  this.server.post('/api/oauth/token', json(400, { error: 'invalid_grant' }));

  visit('/');
  click(testSelector('selector', 'sign-in-header'));
  fillIn(testSelector('selector', 'identification'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'not_password');
  click(testSelector('selector', 'sign-in'), '#wormhole');

  andThen(() => {
    const error = find(testSelector('selector', 'error-message'), '#wormhole').text().trim();
    assert.equal(error, 'The provided credentials are invalid.');
  });
});
