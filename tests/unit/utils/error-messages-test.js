import { module, test } from 'qunit';
import errorMessages from '../../../utils/error-messages';

module('Unit | Utility | error messages', function() {
  test('it returns the first error from an AJAX response', function(assert) {
    const result = errorMessages({
      jqXHR: {
        responseJSON: {
          errors: [{ detail: 'abc' }, { detail: 'def' }]
        }
      }
    });
    assert.equal(result, 'Abc');
  });

  test('it returns the first error from an AdapterError response', function(assert) {
    const result = errorMessages({
      errors: [{ detail: 'abc' }, { detail: 'def' }]
    });
    assert.equal(result, 'Abc');
  });

  test('it returns the error message from the Doorkeeper key', function(assert) {
    const result = errorMessages({
      error: 'invalid_grant'
    });
    assert.equal(result, 'The provided credentials are invalid.');
  });

  test('it returns the default error message', function(assert) {
    let result = errorMessages(undefined);
    assert.equal(result, 'There was an issue with your request, please try again.');
    result = errorMessages({});
    assert.equal(result, 'There was an issue with your request, please try again.');
  });

  test('it returns the default error message for 500', function(assert) {
    let result = errorMessages(undefined);
    result = errorMessages({ errors: [{ detail: 'Internal Server Error' }] });
    assert.equal(result, 'There was an issue with your request, please try again.');
  });
});
