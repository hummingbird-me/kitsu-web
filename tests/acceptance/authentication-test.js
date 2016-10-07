import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';
import { currentSession } from 'client/tests/helpers/ember-simple-auth';
import { Response } from 'ember-cli-mirage';
import testSelector from 'client/tests/helpers/ember-test-selectors';
import jQuery from 'jquery';

moduleForAcceptance('Acceptance | Authentication', {
  beforeEach() {
    jQuery('#ember-testing').append('<div id="wormhole"></div>');
  }
});

test('can create an account', function(assert) {
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
    assert.equal(server.db.users[0].email, 'bob@acme.com');
  });
});

test('displays error on account creation', function(assert) {
  server.post('/users', ({ users }, request) => {
    const params = JSON.parse(request.requestBody);
    const { attributes } = params.data;
    const records = users.where({ email: attributes.email }).models.length > 0;
    const response = new Response(400, {}, {
      errors: [{ detail: 'email is already taken.' }]
    });
    return records === true ? response : users.create(attributes);
  });
  server.create('user', { email: 'bob@acme.com' });

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
  server.create('user', { name: 'bob', password: 'password' });

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
  server.post('http://localhost:4201/api/oauth/token', () => {
    return new Response(400, {}, { error: 'invalid_grant' });
  });
  server.create('user', { name: 'bob', password: 'password' });

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
