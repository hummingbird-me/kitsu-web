import { stripNamespace } from 'client/helpers/strip-namespace';
import { module, test } from 'qunit';

module('Unit | Helper | strip namespace');

test('it strips the namespace', function(assert) {
  const result = stripNamespace(['Namespace::Class']);
  assert.equal(result, 'Class');
});

test('it returns an empty string when no namespace', function(assert) {
  const result = stripNamespace(['Class']);
  assert.equal(result, '');
});

