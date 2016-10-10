import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { currentSession } from 'client/tests/helpers/ember-simple-auth';
import testSelector from 'client/tests/helpers/ember-test-selectors';
import jQuery from 'jquery';
import JaQuery from 'client/tests/ember-ja-query';
import usersResponse, { objectResponse as singleUser } from 'client/tests/helpers/responses/user';
import tokenResponse from 'client/tests/helpers/responses/token';

moduleForAcceptance('Acceptance | Authentication', {
  beforeEach() {
    jQuery('#ember-testing').append('<div id="wormhole"></div>');
  },

  afterEach() {
    if (this.server !== undefined) {
      this.server.shutdown();
    }
  }
});

test('can create an account', function(assert) {
  this.server = new Pretender(function() {
    this.post('/api/edge/users', function() {
      const data = new JaQuery(singleUser);
      return [201, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.get('/api/edge/users', function() {
      const data = new JaQuery(usersResponse);
      return [200, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });

    this.post('/api/oauth/token', () => {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify(tokenResponse)];
    });
  });

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

test('displays error on account creation', function(assert) {
  this.server = new Pretender(function() {
    this.post('/api/edge/users', function() {
      const data = { errors: [{ detail: 'email is already taken.' }] };
      return [400, { 'Content-Type': 'application/json' }, JSON.stringify(data)];
    });
  });

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

test('can sign into an account', function(assert) {
  this.server = new Pretender(function() {
    this.post('/api/oauth/token', () => {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify(tokenResponse)];
    });

    this.get('/api/edge/users', function() {
      const data = new JaQuery(usersResponse);
      return [201, { 'Content-Type': 'application/json' }, data.unwrap(JSON.stringify)];
    });
  });

  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-in-email'), '#wormhole');
  fillIn(testSelector('selector', 'identification'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'password');
  click(testSelector('selector', 'sign-in'), '#wormhole');

  andThen(() => {
    const session = currentSession(this.application);
    assert.ok(session.get('isAuthenticated'));
  });
});

test('displays error when failing signing in', function(assert) {
  this.server = new Pretender(function() {
    this.post('/api/oauth/token', function() {
      const data = { error: 'invalid_grant' };
      return [400, { 'Content-Type': 'application/json' }, JSON.stringify(data)];
    });
  });

  visit('/');
  click(testSelector('selector', 'sign-up-header'));
  click(testSelector('selector', 'sign-in-email'), '#wormhole');
  fillIn(testSelector('selector', 'identification'), '#wormhole', 'bob');
  fillIn(testSelector('selector', 'password'), '#wormhole', 'not_password');
  click(testSelector('selector', 'sign-in'), '#wormhole');

  andThen(() => {
    const error = find(testSelector('selector', 'error-message'), '#wormhole').text().trim();
    assert.equal(error, 'The provided credentials are invalid.');
  });
});
