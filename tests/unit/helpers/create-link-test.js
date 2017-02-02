import { createLink } from 'client/helpers/create-link';
import { module, test } from 'qunit';

module('Unit | Helper | create link');

test('it returns a HTML link element with the passed in data', function(assert) {
  const result = createLink('/this/route', 'Hello, World');
  assert.equal(result.string, '<a href="/this/route">Hello, World</a>');
});
